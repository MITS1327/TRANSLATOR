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

@Injectable()
export class PootleService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async updateDicts(data: UpdateDictsDTO) {
    const { project, po_file: poFileName } = data;
    const filesData = await this.getFiles(project, poFileName);
    const hash = crypto.createHash('md5').update(new Date().toString()).digest('hex');
    const redisData = await this.cacheManager.get<RedisData>(project.toString());

    return this.cacheManager.set<RedisData>(project.toString(), { hash, filesData: { ...redisData?.filesData, ...filesData } });
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

  async getFiles(project: keyof typeof Projects, poFileName: LangsFiles) {
    const url = `${this.configService.get('pootle.url')}assets/lang/${project.toString().toLowerCase()}/${poFileName}`;
    const lang = poFileName.toString().split('.')[0];

    const response = this.httpService
      .request({
        method: 'get',
        url,
        responseType: 'blob',
      })
      .pipe(map((response) => this.convertLangs({ lang, data: response.data })));

    return lastValueFrom(response);
  }
}
