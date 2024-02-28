import { PartialType } from '@nestjs/swagger';

import { CreateLangDTO } from './create-lang.dto';

export class UpdateLangDTO extends PartialType<CreateLangDTO>(CreateLangDTO) {}
