import { registerAs } from '@nestjs/config';

export default registerAs(
  'redis',
  (): Record<string, unknown> => ({
    sentinels: [{ host: process.env.REDIS_SENTINEL_HOST, port: +process.env.REDIS_SENTINEL_PORT }],
    name: process.env.REDIS_SENTINEL_MASTER_NAME,
    db: +process.env.REDIS_CACHE_DATABASE,
  }),
);
