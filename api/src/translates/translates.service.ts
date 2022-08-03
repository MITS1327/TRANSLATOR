import { CACHE_MANAGER, Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UpdateDictsDTO } from './common/translates.dto';
import { HttpService } from '@nestjs/axios';
import { forkJoin, lastValueFrom, map, Observable, } from 'rxjs';
import { ProjectsEnum } from './common/projects.enum';
import * as crypto from 'crypto';
import { Dict, PootleFile, RedisData } from './common/translates.interfaces';
import { Langs } from './common/langs.enum';
import { ConfigService } from '@nestjs/config';
import { HelpersService } from 'src/helpers/helpers.service';

@Injectable()
export class TranslatesService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private readonly httpService: HttpService, private readonly configService: ConfigService,
    private readonly helpersService: HelpersService) { }

  async updateDicts(data: UpdateDictsDTO) {
    const { project } = data;
    const filesData = await this.getFiles(project);

    const hash = crypto.createHash('md5').update(new Date().toString()).digest("hex");

    return this.cacheManager.set<RedisData>(project.toString(), { hash, filesData });
  }

  async getDicts(project: string) {
    if (!project) {
      throw new InternalServerErrorException("Undefined project");
    }
    return this.cacheManager.get<RedisData>(project);
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


  async getFiles(project: ProjectsEnum) {
    const requests: Observable<Dict>[] = [];

    for (const lang of this.helpersService.convertEnumValuesToArray(Langs)) {
      const url = `${this.configService.get("pootle.url")}assets/lang/${project.toString().toLowerCase()}/${lang}.po`;

      requests.push(
        this.httpService.request({
          method: "get",
          url,
          responseType: "blob"
        }).pipe(
          map(response => this.convertLangs({ lang, data: response.data }))
        ),
      );
    }

    return lastValueFrom(
      forkJoin(requests, (...responses) => responses.reduce((accumulator, current) => Object.assign(accumulator, current), {}))
    );
  };

}
