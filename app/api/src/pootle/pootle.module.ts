import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { PootleController } from './pootle.controller';
import { PootleService } from './pootle.service';

@Module({
  imports: [HttpModule],
  providers: [PootleService],
  controllers: [PootleController],
})
export class PootleModule {}
