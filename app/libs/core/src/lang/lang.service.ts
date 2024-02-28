import { Inject, Injectable } from '@nestjs/common';

import { GetDataWithFilterOutputObject } from '@translator/shared';

import { CreateLangInputObject, GetLangsWithFilterInputObject, UpdateLangInputObject } from './input-objects';
import { LangEntity, LangRepository, LangService } from './interfaces';
import { LANG_REPOSITORY_PROVIDER } from './lang.di-tokens';

@Injectable()
export class LangServiceImpl implements LangService {
  constructor(@Inject(LANG_REPOSITORY_PROVIDER) private readonly langRepository: LangRepository) {}

  async getLangs(data: GetLangsWithFilterInputObject): Promise<GetDataWithFilterOutputObject<LangEntity>> {
    const { limit, offset, sortBy, orderBy, filter } = data;
    const additionalFilter = this.langRepository.filterBuilder(filter);

    return this.langRepository.getWithLimitAndOffset(additionalFilter, limit, offset, orderBy, sortBy);
  }

  async createLang(data: CreateLangInputObject): Promise<void> {
    await this.langRepository.create(data);
  }

  async updateLang(data: UpdateLangInputObject): Promise<void> {
    await this.langRepository.updateOneById(data.id, data);
  }
}
