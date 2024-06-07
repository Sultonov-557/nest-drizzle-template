import { defineConfig } from 'drizzle-kit';
import { env } from 'src/common/config';

export default defineConfig({
  dialect: 'mysql',
  schema: './src/common/database/schema.ts',
  dbCredentials: {
    database: env.DB_NAME,
    host: env.DB_HOST,
    user: env.DB_USERNAME,
    port: env.DB_PORT,
    password: env.DB_PASSWORD,
  },
  out: './drizzle',
});
