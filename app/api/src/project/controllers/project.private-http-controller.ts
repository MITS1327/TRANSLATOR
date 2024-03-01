import {
  Body,
  ConflictException,
  Controller,
  FileTypeValidator,
  Get,
  Inject,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { UserId } from '@decorators/auth.decorators';
import { rm } from 'fs/promises';
import { diskStorage } from 'multer';

import { PROJECT_SERVICE_PROVIDER, ProjectService } from '@translator/core/project';

import { FILE_TYPE, MAX_FILE_SIZE, MAX_FILES_COUNT } from '../constants';
import { CreateProjectDTO, GetProjectsWithFilterDTO, UpdateProjectDTO } from '../dtos';

@Controller({
  path: 'projects',
  version: 'private',
})
@ApiTags('projects')
export class ProjectPrivateHttpController {
  constructor(@Inject(PROJECT_SERVICE_PROVIDER) private readonly projectService: ProjectService) {}

  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(
    FilesInterceptor('pootleFiles', MAX_FILES_COUNT, {
      storage: diskStorage({
        destination: '/tmp/pootle_files',
      }),
    }),
  )
  async createProject(
    @UserId() userId: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
          new FileTypeValidator({ fileType: FILE_TYPE }),
        ],
        fileIsRequired: false,
      }),
    )
    pootleFiles: Express.Multer.File[],
    @Body() data: CreateProjectDTO,
  ) {
    if (
      pootleFiles.length &&
      data.langsIdsToFilesAssociations.length &&
      pootleFiles.length !== data.langsIdsToFilesAssociations.length
    ) {
      throw new ConflictException('Number of files does not match number of languages associations');
    }

    await this.projectService.createProject({
      name: data.name,
      userId,
      langFiles: data.langsIdsToFilesAssociations.map((langId, index) => ({
        langId,
        path: pootleFiles[index].path,
      })),
    });

    await Promise.all(pootleFiles.map((file) => rm(file.path)));
  }

  @Get()
  getProjects(@Query() data: GetProjectsWithFilterDTO) {
    return this.projectService.getProjects(data);
  }

  @Patch(':id')
  updateProject(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateProjectDTO) {
    return this.projectService.updateProject({ ...data, id });
  }
}
