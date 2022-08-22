import { Module } from '@nestjs/common';
import { PootleService } from './pootle.service';
import { PootleController } from './pootle.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PootleService],
  controllers: [PootleController],
})
export class PootleModule {}
