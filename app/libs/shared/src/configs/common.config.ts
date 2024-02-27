import { registerAs } from '@nestjs/config';

export default registerAs('common', () => ({
  graylogHost: process.env.GRAYLOG_HOST,
  graylogPort: process.env.GRAYLOG_PORT,
  project: process.env.PROJECT,
}));
