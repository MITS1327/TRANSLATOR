import { registerAs } from '@nestjs/config';

export default registerAs(
  'pootle',
  (): Record<string, unknown> => ({
    url: process.env.POOTLE_API_URL,
    secret: process.env.POOTLE_API_SECRET,
  }),
);
