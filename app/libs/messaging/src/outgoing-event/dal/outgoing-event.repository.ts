import { InjectRepository } from '@nestjs/typeorm';

import { BaseRepositoryImpl } from '@vpbx/shared/dal';
import { Repository } from 'typeorm';

import { OutgoingEventRepository } from '../interfaces';
import { OutgoingEventEntityImpl } from './outgoing-event.entity';

export class OutgoingEventRepositoryImpl
  extends BaseRepositoryImpl<OutgoingEventEntityImpl>
  implements OutgoingEventRepository
{
  constructor(
    @InjectRepository(OutgoingEventEntityImpl) private outgoingEventRepository: Repository<OutgoingEventEntityImpl>,
  ) {
    super(outgoingEventRepository.target, outgoingEventRepository.manager);
  }
}
