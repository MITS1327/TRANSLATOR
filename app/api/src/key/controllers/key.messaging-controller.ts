import { Controller, UseFilters, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload, Transport } from '@nestjs/microservices';

import { BadRequestExceptionFilter, ConflictExceptionFilter, MessagingTopicEnum } from '@translator/messaging';

import { CacheKeyService } from '../cache-key.service';
import { CreateKeyEventDTO, UpdateKeyEventDTO } from '../dtos';

@Controller()
export class KeyMessagingController {
  constructor(private readonly cacheKeyService: CacheKeyService) {}

  @UseFilters(new BadRequestExceptionFilter(), new ConflictExceptionFilter())
  @EventPattern(MessagingTopicEnum.TRANSLATOR_EVENTS, Transport.KAFKA)
  async handleCreateKeyEvent(@Payload(new ValidationPipe()) message: CreateKeyEventDTO) {
    await this.cacheKeyService.addKey(message.data);
  }

  @UseFilters(new BadRequestExceptionFilter(), new ConflictExceptionFilter())
  @EventPattern(MessagingTopicEnum.TRANSLATOR_EVENTS, Transport.KAFKA)
  async handleUpdateKeyEvent(@Payload(new ValidationPipe()) message: UpdateKeyEventDTO) {
    await this.cacheKeyService.updateKey(message.data);
  }
}
