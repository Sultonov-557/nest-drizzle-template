import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { DrizzleMySqlModule } from '@knaadh/nestjs-drizzle-mysql2';
import { DBconfig } from 'src/common/database/config.database';

@Module({
  imports: [DrizzleMySqlModule.register(DBconfig)],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
