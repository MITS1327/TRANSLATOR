import { Cookies } from '@decorators/cookie.decorator';
import { Project } from '@decorators/project.decorator';
import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ProjectsEnum } from './common/projects.enum';
import { UpdateDictsDTO } from './common/translates.dto';
import { TranslatesService } from './translates.service';

@Controller('translates')
export class TranslatesController {
  constructor(private readonly translatesService: TranslatesService) { }

  @Post("updateDicts")
  async updateDicts(@Body() data: UpdateDictsDTO) {
    console.log("updateDicts");
    this.translatesService.updateDicts(data);
  }

  @Get("getDicts")
  async getDicts(@Cookies("mcn_status") mcnStatus: string, @Res() response: Response, @Project() project: string) {
    const projectPootleName = ProjectsEnum[project];
    const { hash, filesData } = await this.translatesService.getDicts(projectPootleName) || {};

    console.log(mcnStatus, project, hash);


    if (hash && hash !== mcnStatus) {
      response.cookie('mcn_status', hash, {
        sameSite: 'strict',
        httpOnly: true,
      });
      response.json(filesData);
    } else {
      response.send();
    }
  }
}

