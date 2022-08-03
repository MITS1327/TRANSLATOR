import { Controller, Get } from '@nestjs/common';

@Controller('translates')
export class TranslatesController {
  @Get("updateDicts")
  log(): string {
    console.log("!!!");
    return "test";
  }
}

