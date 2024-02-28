import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity, GetDataWithFilterOutputObject } from '@translator/shared/core';

export class GetDataWithFilterResponseDTO<T extends BaseEntity> implements GetDataWithFilterOutputObject<T> {
  @ApiProperty({
    isArray: true,
    type: BaseEntity,
  })
  data: T[];

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;

  @ApiProperty()
  totalCount: number;
}
