import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
import { env } from '../config';

@Injectable()
export class RedisService implements OnModuleDestroy, OnModuleInit {
  private readonly _redis = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    lazyConnect: true,
  });
  private readonly logger = new Logger(RedisService.name);

  get redis() {
    return this._redis;
  }

  async onModuleInit() {
    await this._redis.connect();
    this.logger.log('Redis connected');
  }

  async onModuleDestroy() {
    await this._redis.quit();
    this.logger.log('Redis disconnected');
  }
}
