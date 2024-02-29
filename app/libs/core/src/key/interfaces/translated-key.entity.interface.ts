import { LangEntity } from '@translator/core/lang';
import { ProjectEntity } from '@translator/core/project';

import { BaseEntity } from '@translator/shared/core';

export type TranslatedKeyLog = {
  newValue: string;
  oldValue: string;
  userId: string | null;
};

export interface TranslatedKeyEntity extends BaseEntity {
  id: number;
  projectId: ProjectEntity['id'];
  langId: LangEntity['id'];
  name: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
  logs: TranslatedKeyLog[];
  comment: string | null;
}
