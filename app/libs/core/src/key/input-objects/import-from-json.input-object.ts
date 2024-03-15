import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { TranslatedKeyEntity, TranslatedKeyLog } from '../interfaces';

export interface ImportFromJSONInputObject {
  projectId: TranslatedKeyEntity['projectId'];
  langId: TranslatedKeyEntity['langId'];
  userId: TranslatedKeyLog['userId'] | null;
  filePath: string;
}

export class JsonUpdateKeyObject {
  @IsNotEmpty()
  @IsNumber()
  id: TranslatedKeyEntity['id'];

  @IsNotEmpty()
  @IsString()
  name: TranslatedKeyEntity['name'];

  @IsNotEmpty()
  @IsString()
  value: TranslatedKeyEntity['value'];

  @IsOptional()
  @IsString()
  comment: TranslatedKeyEntity['comment'];
}
