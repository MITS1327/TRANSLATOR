import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';

import { ExcludeGraylogLogging } from 'api/src/common/decorators/exclude-graylog-logging.decorator';

@Controller('healthz')
@ApiExcludeController()
@ExcludeGraylogLogging()
export class HealthController {
  @Get()
  @HealthCheck()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  check() {}
}
