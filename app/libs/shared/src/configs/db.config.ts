import { registerAs } from '@nestjs/config';

import { MIGRATIONS } from 'migrations';
import * as path from 'path';
import { BaseDataSourceOptions } from 'typeorm/data-source/BaseDataSourceOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const translatorDatabaseCredentials: PostgresConnectionOptions = {
  type: 'postgres',
  schema: process.env.POSTGRES_SCHEMA,
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  port: +process.env.POSTGRES_PORT,
};

export const defaultDatabaseConfig: Omit<BaseDataSourceOptions, 'type'> = {
  logging: false,
  synchronize: false,
  entities: [path.join(__dirname, '../../../{core,messaging}/**/*.entity.{ts,js}')],
  namingStrategy: new SnakeNamingStrategy(),
  migrationsTableName: 'migrations',
  migrationsRun: true,
  migrations: MIGRATIONS,
};

export const databaseConfig = {
  ...defaultDatabaseConfig,
  ...translatorDatabaseCredentials,
};

export default registerAs('db', () => databaseConfig);
