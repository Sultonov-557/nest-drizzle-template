import { DrizzleMySqlConfig } from '@knaadh/nestjs-drizzle-mysql2/src/mysql.interface';
import { env } from '../config';
import * as schema from './schema';

export const DBconfig: DrizzleMySqlConfig & Partial<{ tag: string }> = {
  tag: 'DB',
  mysql: {
    connection: 'client',
    config: {
      host: env.DB_HOST,
      user: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      port: env.DB_PORT,
      database: env.DB_NAME,
    },
  },
  config: { schema, mode: 'default' },
};
