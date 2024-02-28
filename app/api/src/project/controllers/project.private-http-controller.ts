import { Body, Controller, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PROJECT_SERVICE_PROVIDER, ProjectService } from '@translator/core/project';

import { CreateProjectDTO, GetProjectsWithFilterDTO, UpdateProjectDTO } from '../dtos';

@Controller({
  path: 'projects',
  version: 'private',
})
@ApiTags('projects')
export class ProjectPrivateHttpController {
  constructor(@Inject(PROJECT_SERVICE_PROVIDER) private readonly projectService: ProjectService) {}

  @Post()
  createProject(@Body() data: CreateProjectDTO) {
    return this.projectService.createProject(data);
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
