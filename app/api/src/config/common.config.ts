import { registerAs } from '@nestjs/config';

export default registerAs(
  'common',
  (): Record<string, unknown> => ({
    project: process.env.PROJECT,
  }),
);
