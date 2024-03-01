import { Inject, Injectable } from '@nestjs/common';

import { IsolationLevel, Transactional } from 'typeorm-transactional';

import {
  BaseOutgoingEventService,
  KAFKA_OUTGOING_EVENT_SERVICE_PROVIDER,
  OutgoingEventTypeEnum,
} from '@translator/messaging';

import { GetDataWithFilterOutputObject } from '@translator/shared';

import { CreateLangKafkaEvent } from './events';
import { CreateLangInputObject, GetLangsWithFilterInputObject, UpdateLangInputObject } from './input-objects';
import { LangEntity, LangRepository, LangService } from './interfaces';
import { LANG_REPOSITORY_PROVIDER } from './lang.di-tokens';

@Injectable()
export class LangServiceImpl implements LangService {
  constructor(
    @Inject(LANG_REPOSITORY_PROVIDER) private readonly langRepository: LangRepository,
    @Inject(KAFKA_OUTGOING_EVENT_SERVICE_PROVIDER) private readonly outgoingEventService: BaseOutgoingEventService,
  ) {}

  async getLangs(data: GetLangsWithFilterInputObject): Promise<GetDataWithFilterOutputObject<LangEntity>> {
    const { limit, offset, sortBy, orderBy, filter } = data;
    const additionalFilter = this.langRepository.filterBuilder(filter);

    return this.langRepository.getWithLimitAndOffset(additionalFilter, limit, offset, orderBy, sortBy);
  }

  @Transactional({ isolationLevel: IsolationLevel.READ_UNCOMMITTED })
  async createLang(data: CreateLangInputObject): Promise<void> {
    await this.langRepository.create(data);
    await this.outgoingEventService.emitFromPersist(
      new CreateLangKafkaEvent(OutgoingEventTypeEnum.EXTERNAL, {
        langName: data.name,
      }),
    );
  }

  async updateLang(data: UpdateLangInputObject): Promise<void> {
    await this.langRepository.updateOneById(data.id, data);
  }
}
