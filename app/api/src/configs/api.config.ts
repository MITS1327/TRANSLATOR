import { registerAs } from '@nestjs/config';

export default registerAs('apiConfig', () => ({
  prefix: process.env.API_PREFIX,
  swaggerPath: process.env.SWAGGER_PATH,
}));
