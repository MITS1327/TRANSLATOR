import { BadRequestException, CACHE_MANAGER, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ChangeKeyDTO, GetDictDTO } from './common/translates.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map } from 'rxjs';
import { Projects } from '../common/enums/projects.enum';
import { ConfigService } from '@nestjs/config';
import { HelpersService } from 'src/helpers/helpers.service';
import { AxiosResponse } from 'axios';
import { RedisData } from '@common/interfaces/redisData.interface';

@Injectable()
export class TranslatesService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly helpersService: HelpersService,
  ) { }

  async getDicts(data: GetDictDTO, project: Projects) {
    const { project: queryProject } = data;

    const projectPootleName = this.getProject(queryProject ?? project);

    return this.cacheManager.get<RedisData>(projectPootleName);
  }

  getProject(project: Projects) {
    const enumObj = this.helpersService.convertEnumToObject(Projects);
    const projectName = this.helpersService.findObjectKeyByValue(enumObj, project);

    if (!projectName) {
      throw new BadRequestException('Undefined project');
    }

    return this.helpersService.findObjectKeyByValue(enumObj, project);
  }

  async changeKey(data: ChangeKeyDTO, project: Projects) {
    const url = `${this.configService.get('pootle.url')}api/v1/lang-key`;

    const projectPootleName = this.getProject(data.project ?? project);

    return lastValueFrom(
      this.httpService
        .request({
          method: 'put',
          url,
          data: { ...data, secret: this.configService.get('pootle.secret'), project: projectPootleName },
        })
        .pipe(
          map((response: AxiosResponse) => {
            if (!response.data || response.data?.error) {
              throw new InternalServerErrorException(`Pootle return error: ${response.data?.error || ''}`);
            }
          }),
          catchError((error) => {
            throw new InternalServerErrorException(error.message);
          }),
        ),
    );
  }
}
