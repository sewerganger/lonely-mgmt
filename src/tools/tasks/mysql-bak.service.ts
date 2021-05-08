import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import mysqldump from 'mysqldump';
import dayjs from 'dayjs';
import { resolve } from 'path';
import * as os from 'os';
import { nanoid } from 'nanoid';
const pkg = require('../../../package.json');
const ormconfig = require('../../../ormconfig');

const savePath = resolve(os.homedir(), `.mysql-bak/${pkg.name}`);

@Injectable()
export class MySqlBakService {
  @Cron('* * 2 * * *')
  handleMysqlDump() {
    console.log(MySqlBakService.name, 'mysql bak');
    mysqldump({
      connection: {
        host: ormconfig.host,
        user: ormconfig.username,
        password: ormconfig.password,
        database: ormconfig.database,
      },
      dumpToFile: resolve(
        savePath,
        `${dayjs().format('YYYY-MM-DD')}-${nanoid(8)}.sql.gz`,
      ),
      compressFile: true,
    });
  }
}
