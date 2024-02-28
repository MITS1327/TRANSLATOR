import { LangEntity } from '@translator/core/lang';
import { ProjectEntity } from '@translator/core/project';

import { BaseEntity } from '@translator/shared/core';

export interface KeyEntity extends BaseEntity {
  id: number;
  projectId: ProjectEntity['id'];
  langId: LangEntity['id'];
  name: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
}
