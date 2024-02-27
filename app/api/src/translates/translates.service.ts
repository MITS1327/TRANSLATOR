import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Langs } from 'api/src/common/enums/langs.enum';
import { LangDict } from 'api/src/common/interfaces/langDict.interface';
import { RedisData } from 'api/src/common/interfaces/redisData.interface';
import { convertEnumToObject, convertEnumValuesToArray, findObjectKeyByValue } from 'api/src/utils';
import { AxiosResponse } from 'axios';
import { Cache } from 'cache-manager';
import { catchError, lastValueFrom, map } from 'rxjs';

import { Projects } from '../common/enums/projects.enum';
import { ChangeKeyDTO, GetDictDTO, GetNotTranslatedDictsDTO } from './common/translates.dto';
import { OrderByOptions } from './common/translates.enum';
import { GetDictsRO, NotTranslatedDictsRO, NotTranslatedKey } from './common/translates.interfaces';

@Injectable()
export class TranslatesService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getDicts(data: GetDictDTO, project: Projects): Promise<GetDictsRO> {
    const { project: queryProject } = data;

    const projectName = queryProject ?? project;
    const projectPootleName = this.getProject(projectName);
    const redisData = await this.cacheManager.get<RedisData>(projectPootleName);

    return { ...redisData, projectName };
  }

  getProject(project: Projects): Projects {
    const enumObj = convertEnumToObject(Projects);
    const projectName = findObjectKeyByValue(enumObj, project);

    if (!projectName) {
      throw new NotFoundException('Project not found');
    }

    return findObjectKeyByValue(enumObj, project) as Projects;
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
  private getNotTranslatedKeysByDict(dict: LangDict, project: Projects, lang: Langs): NotTranslatedKey[] {
    if (!dict) {
      return [];
    }

    return Object.keys(dict).reduce<NotTranslatedKey[]>(
      (acc: NotTranslatedKey[], langKey: string): NotTranslatedKey[] => {
        if (langKey === dict[langKey]) {
          acc.push({
            key: langKey,
            project,
            lang,
          });
        }

        return acc;
      },
      [],
    );
  }

  private async getNotTranslatedDict(project: Projects, lang?: Langs) {
    const redisData = await this.cacheManager.get<RedisData>(project);
    if (!redisData) {
      return null;
    }

    const { filesData } = redisData;

    let notTranslatedKeys = [];
    if (lang) {
      notTranslatedKeys = this.getNotTranslatedKeysByDict(filesData[lang], project, lang);
    } else {
      for (const langDict of Object.keys(filesData)) {
        notTranslatedKeys.push(
          ...this.getNotTranslatedKeysByDict(filesData[langDict], project, langDict as unknown as Langs),
        );
      }
    }

    return {
      count: notTranslatedKeys.length,
      keys: notTranslatedKeys,
    };
  }

  async getNotTranslatedDicts(data: GetNotTranslatedDictsDTO): Promise<NotTranslatedDictsRO> {
    const { project, lang, page, limitPerPage, sortBy, orderBy } = data;
    let dicts = {
      count: 0,
      keys: [],
    };

    if (project) {
      const projectPootleName = this.getProject(project);
      dicts = await this.getNotTranslatedDict(projectPootleName, lang);
    } else {
      const redisKeys = await this.cacheManager.store.keys();
      for (const redisKey of redisKeys) {
        const notTranslatedDict = await this.getNotTranslatedDict(redisKey as Projects, lang);
        dicts.keys = [...dicts.keys, ...notTranslatedDict.keys];
      }
    }

    if (sortBy) {
      dicts.keys = dicts.keys.sort((a: NotTranslatedKey, b: NotTranslatedKey) => {
        return a[sortBy].localeCompare(b[sortBy], { ignorePunctuation: true });
      });
    }

    if (orderBy === OrderByOptions.Desc) {
      dicts.keys = dicts.keys.reverse();
    }

    dicts.count = dicts.keys.length;
    const offset = (page - 1) * limitPerPage;
    dicts.keys = dicts.keys.slice(offset, offset + limitPerPage);

    return dicts;
  }

  async getProjects() {
    return Object.values(Projects);
  }

  async getLangs() {
    return convertEnumValuesToArray(Langs);
  }
}
