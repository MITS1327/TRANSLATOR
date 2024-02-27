import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { catchError, lastValueFrom, map, of } from 'rxjs';

import { convertEnumValuesToArray } from 'api/src/utils';

import { Dict } from 'api/src/common/types/dict.type';
import { RedisData } from 'api/src/common/interfaces/redisData.interface';

import { PootleFile } from 'api/src/translates/common/translates.interfaces';

import { Projects } from '../common/enums/projects.enum';
import { LangsFiles } from './common/langsFiles.enum';
import { UpdateDictsDTO } from './common/pootle.dto';
import { GetFileRO } from './common/pootle.interfaces';

@Injectable()
export class PootleService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async setDictsToRedis(project: keyof typeof Projects, fileData: Dict) {
    const unixTime = Math.floor(Date.now() / 1000).toString();
    const redisData = await this.cacheManager.get<RedisData>(project.toString());

    return this.cacheManager.set(project.toString(), {
      unixTime,
      filesData: { ...redisData?.filesData, ...fileData },
    });
  }

  async updateProjectDicts(data: UpdateDictsDTO, project: keyof typeof Projects) {
    const { poFileName } = data;
    const { data: fileData } = await this.getFile(project, poFileName);
    this.setDictsToRedis(project, fileData);
  }

  async updateDicts() {
    const requests: Promise<GetFileRO>[] = [];
    const projects = Object.keys(Projects) as (keyof typeof Projects)[];
    const poFileNames = convertEnumValuesToArray<LangsFiles>(LangsFiles);
    for (const project of projects) {
      for (const poFileName of poFileNames) {
        requests.push(this.getFile(project, poFileName));
      }
    }
    const responses = await Promise.all(requests);

    for (const { project, data: fileData } of responses) {
      await this.setDictsToRedis(project, fileData);
    }
  }

  convertLangs(file: PootleFile): Dict {
    const dicts = {};

    const { lang, data } = file;
    dicts[lang] = {};

    let key;
    let value;
    for (const line of data.split('\n')) {
      if (line.startsWith('msgid')) {
        key = line.substring(7, line.length - 1);
      }
      if (line.startsWith('msgstr') && key) {
        value = line.substring(8, line.length - 1);
      }
      if (line.startsWith('"') && key) {
        value += line.substring(1, line.length - 1);
      }
      if (!line.length && key && value) {
        dicts[lang][key] = value;
      }
    }

    if (key && value) {
      dicts[lang][key] = value;
    }

    return dicts as Dict;
  }

  async getFile(project: keyof typeof Projects, poFileName: LangsFiles): Promise<GetFileRO> {
    const url = `${this.configService.get('pootle.url')}assets/lang/${project.toString().toLowerCase()}/${poFileName}`;
    const lang = poFileName.toString().split('.')[0];

    const response = this.httpService
      .request({
        method: 'get',
        url,
        responseType: 'blob',
      })
      .pipe(
        map((response) => ({
          project,
          data: this.convertLangs({ lang, data: response.data }),
        })),
        catchError(() =>
          of({
            project,
            data: {} as Dict,
          }),
        ),
      );

    return lastValueFrom(response);
  }
}
