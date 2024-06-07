import { Module } from '@nestjs/common';
import { DBconfig } from './common/database/config.database';
import { RedisModule } from './common/redis/redis.module';
import { AdminModule } from './modules/admin/admin.module';
import { DrizzleMySqlModule } from '@knaadh/nestjs-drizzle-mysql2';

@Module({
  imports: [DrizzleMySqlModule.register(DBconfig), AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
