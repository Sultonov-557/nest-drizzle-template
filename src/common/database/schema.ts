import { date, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const admin = mysqlTable('admin', {
  id: int('id').primaryKey().autoincrement(),
  username: varchar('name', { length: 255 }).unique(),
  password: varchar('password', { length: 255 }),
  full_name: varchar('full_name', { length: 255 }).default('admin'),
  refresh_token: varchar('refresh_token', { length: 255 }),
  created_at: date('created_at').$defaultFn(() => new Date(Date.now())),
});

export const Admin = typeof admin.$inferSelect;
export const NewAdmin = typeof admin.$inferInsert;
