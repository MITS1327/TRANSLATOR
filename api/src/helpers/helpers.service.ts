import { Injectable } from '@nestjs/common';
import { ObjectInterface } from './helpers.interface';

@Injectable()
export class HelpersService {
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
