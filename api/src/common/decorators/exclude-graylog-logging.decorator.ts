import { SetMetadata } from '@nestjs/common';

export const ExcludeGraylogLogging = () => SetMetadata('GRAYLOG_INTERCEPTOR_SKIP', true);
