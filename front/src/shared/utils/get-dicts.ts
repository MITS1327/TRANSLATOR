import { deepmerge } from 'mcn-ui-components/utils';
import { Dict } from 'shared/types';
import { IS_EU_PROD } from 'shared/config';
import { PRODUCTS_HASH_KEY } from 'shared/consts';
import { apiTranslator } from '../api';

const defaultLang = IS_EU_PROD ? 'en_US' : 'ru_RU';

const getDictData = (data: Dict, project = 'project') => {
  if (data) {
    localStorage.setItem(project, JSON.stringify(data));
  }
  return JSON.parse(localStorage.getItem(project));
};

const setProjectDicts = async (translatorDict: Dict, needLocalDict: boolean) => {
  const dict = translatorDict || {};

  if (needLocalDict || Object.keys(dict).length === 0) {
    // eslint-disable-next-line import/extensions
    // const localDict = (await import('../../../dicts')).dict;
    // window.dictTR = deepmerge(localDict, dict);
  } else {
    window.dictTR = dict;
  }
};

export const getDicts = async () => {
  const dictMcnParams = { project: 'mcn-ui-components' };
  const dictProjectParams = { project: 'webphone' };

  try {
    const translatorDicts = await Promise.all([
      apiTranslator.getDicts(dictMcnParams),
      apiTranslator.getDicts(dictProjectParams),
    ]);

    const componentsHash = translatorDicts?.[0]?.headers[PRODUCTS_HASH_KEY] || null;
    const projectHash = translatorDicts?.[1]?.headers[PRODUCTS_HASH_KEY] || null;

    const productsHash = {
      ...JSON.parse(localStorage.getItem(PRODUCTS_HASH_KEY)),
      ...JSON.parse(componentsHash),
      ...JSON.parse(projectHash),
    };

    localStorage.setItem(PRODUCTS_HASH_KEY, JSON.stringify(productsHash));

    const translatorDictMcn = getDictData(translatorDicts?.[0]?.data, dictMcnParams.project);
    const translatorDictTelephony = getDictData(translatorDicts?.[1]?.data, dictProjectParams.project);

    window.dict = deepmerge(window.dict, translatorDictMcn);
    await setProjectDicts(translatorDictTelephony, process.env.NODE_ENV === 'development');
  } catch (e) {
    await setProjectDicts(null, true);
  }

  window.coreTR = {
    trans: (lang: string, str: string) => {
      return window.dictTR[lang || defaultLang]?.[str] || str;
    },
  };
};
