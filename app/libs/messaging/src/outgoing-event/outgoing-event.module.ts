import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KAFKA_PROVIDER } from '@translator/shared';

import { OutgoingEventEntityImpl } from './dal';
import { PROVIDERS } from './outgoing-event.providers';

const kafkaClientModule = ClientsModule.registerAsync([
  {
    name: KAFKA_PROVIDER,
    useFactory: async (configService: ConfigService) => {
      return configService.get('kafka');
    },
    inject: [ConfigService],
  },
]);

const IMPORTS = [TypeOrmModule.forFeature([OutgoingEventEntityImpl]), kafkaClientModule];

@Module({
  imports: IMPORTS,
  providers: PROVIDERS,
  exports: [...PROVIDERS, ...IMPORTS],
})
export class OutgoingEventModule {}
