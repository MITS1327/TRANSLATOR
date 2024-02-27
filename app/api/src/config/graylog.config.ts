import { registerAs } from '@nestjs/config';

export default registerAs(
  'graylog',
  (): Record<string, unknown> => ({
    host: process.env.GRAYLOG_HOST,
    port: process.env.GRAYLOG_PORT,
  }),
);
