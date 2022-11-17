import { Injectable } from '@nestjs/common';
import { ObjectInterface } from './helpers.interface';

@Injectable()
export class HelpersService {
  convertEnumValuesToArray<T>(initialEnum): T[] {
    const isStringNumber = (value) => !isNaN(Number(value));

    return Object.keys(initialEnum)
      .filter((key: string) => isStringNumber(key))
      .map((key: string) => initialEnum[key]);
  }

  convertEnumToObject<T>(initialEnum): ObjectInterface<T> {
    return Object.entries(initialEnum).reduce((previousValue, currentValue) => {
      return { ...previousValue, [currentValue[0]]: currentValue[1] };
    }, {});
  }

  findObjectKeyByValue<T>(object: ObjectInterface<T>, value: T): string {
    return Object.keys(object).find((key) => {
      return object[key] === value;
    });
  }
}
