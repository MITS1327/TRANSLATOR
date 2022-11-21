import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { Projects } from '../common/enums/projects.enum';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { UpdateDictsDTO } from './common/pootle.dto';
import { RedisData } from '@common/interfaces/redisData.interface';
import { Dict } from '@common/interfaces/dict.interface';
import { PootleFile } from 'src/translates/common/translates.interfaces';
import { LangsFiles } from './common/langsFiles.enum';
import { HelpersService } from 'src/helpers/helpers.service';
import { GetFileRO } from './common/pootle.interfaces';

@Injectable()
export class PootleService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly helpersService: HelpersService
  ) {}

  async setDictsToRedis(project: keyof typeof Projects, fileData: Dict) {
    const hash = crypto.createHash('md5').update(new Date().toString()).digest('hex');
    const redisData = await this.cacheManager.get<RedisData>(project.toString());

    return this.cacheManager.set<RedisData>(project.toString(), { hash, filesData: { ...redisData?.filesData, ...fileData } });
  }

  async updateProjectDicts(data: UpdateDictsDTO, project: keyof typeof Projects) {
    const { poFileName } = data;
    const { data: fileData } = await this.getFile(project, poFileName);
    this.setDictsToRedis(project, fileData);
  }

  async updateDicts() {
    const requests: Promise<GetFileRO>[] = [];
    const projects = Object.keys(Projects) as (keyof typeof Projects)[];
    const poFileNames = this.helpersService.convertEnumValuesToArray<LangsFiles>(LangsFiles);
    for (const project of projects) {
      for (const poFileName of poFileNames) {
        requests.push(this.getFile(project, poFileName));
      }
    }
    const responses = await Promise.all(requests);

    for (const {project, data: fileData} of responses) {
      await this.setDictsToRedis(project, fileData);
    }
  }

  convertLangs(file: PootleFile): Dict {
    const dicts: Dict = {};

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

    return dicts;
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
      .pipe(map((response) => ({
        project,
        data: this.convertLangs({ lang, data: response.data })
      })));

    return lastValueFrom(response);
  }
}
