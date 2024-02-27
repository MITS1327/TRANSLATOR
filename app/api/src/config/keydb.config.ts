import { registerAs } from '@nestjs/config';

export default registerAs(
  'keydb',
  (): Record<string, unknown> => ({
    host: process.env.KEYDB_HOST,
    port: process.env.KEYDB_PORT,
  }),
);
