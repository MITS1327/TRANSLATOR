import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { BaseRepositoryImpl } from '@translator/shared/dal';

import { LangEntity, LangRepository } from '../interfaces';
import { LangEntityImpl } from './lang.entity';

export class ProjectRepositoryImpl extends BaseRepositoryImpl<LangEntityImpl> implements LangRepository {
  constructor(
    @InjectRepository(LangEntityImpl)
    private langRepository: Repository<LangEntityImpl>,
  ) {
    super(langRepository.target, langRepository.manager);
  }

  async createFromPlainObject(data: LangEntity): Promise<void> {
    await this.repo.query('INSERT INTO translator.lang (lang_id, name, is_translatable) VALUES ($1, $2, $3)', [
      data.id,
      data.name,
      data.isTranslatable,
    ]);
  }

  async getNextLangId(): Promise<number> {
    const [{ next_val }] = await this.langRepository.query(
      'SELECT nextval(\'translator.lang_lang_id_seq\'::regclass) AS next_val',
    );

    return next_val;
  }
}
