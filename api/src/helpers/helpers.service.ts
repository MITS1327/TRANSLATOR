import { Injectable } from '@nestjs/common';

@Injectable()
export class HelpersService {
  convertEnumValuesToArray<T>(initialEnum: T): string[] {
    const StringIsNumber = (value) => isNaN(Number(value)) === false;

    return Object.keys(initialEnum)
      .filter((key: string) => StringIsNumber(key))
      .map((key: string) => initialEnum[key]);
  }
}
