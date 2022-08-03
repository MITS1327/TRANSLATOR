import { Controller, Get } from '@nestjs/common';

@Controller('translates')
export class TranslatesController {
  @Get("log")
  log(): string {
    console.log("!!!");
    return "wdwd";
  }
}

