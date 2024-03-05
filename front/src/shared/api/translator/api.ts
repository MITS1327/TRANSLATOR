import { PRODUCTS_HASH_KEY } from 'shared/consts';
import { API_DOMAINS } from '../../config/index';
import { instanceWithOptions } from '../instance';
import * as types from './types';

const translator = instanceWithOptions({
  baseURL: API_DOMAINS.translator,
});

const translatorProtected = instanceWithOptions({
  baseURL: API_DOMAINS.translatorProtected,
});

// eslint-disable-next-line import/prefer-default-export
export const apiTranslator = {
  getDicts(payload: types.GetDictsPayload) {
    const url = '/translates/dicts';
    return translator.get(url, {
      params: payload,
      timeout: 1500,
      headers: {
        [PRODUCTS_HASH_KEY]: localStorage.getItem(PRODUCTS_HASH_KEY),
      },
    });
  },
  getProjects(payload?: Partial<types.GetProjectsPayload>) {
    const url = '/projects';
    return translatorProtected.get(url, {
      params: payload,
    });
  },
  createProject(payload?: types.CreateProjectPayload) {
    const url = '/projects';
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('langsIdsToFilesAssociations', payload.langsIdsToFilesAssociations?.join(',') || '');

    payload.pootleFiles.forEach((el) => {
      formData.append('pootleFiles', el);
    });

    return translatorProtected.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getLangs(payload?: Partial<types.GetProjectsPayload>) {
    const url = '/langs';
    return translatorProtected.get(url, {
      params: payload,
    });
  },
  createLang(payload?: string) {
    const url = '/langs';
    return translatorProtected.post(url, {
      name: payload,
    });
  },
  getKeys(payload?: Partial<types.GetProjectsPayload>) {
    const url = '/translated-keys';
    return translatorProtected.get(url, { params: payload });
  },
  updateKey(payload?: types.UpdateKeyValue) {
    const url = `/translated-keys/${payload.id}`;
    return translatorProtected.patch(url, { value: payload.value });
  },
  createKey(payload?: types.CreateKeyPayload) {
    const url = '/keys';
    return translatorProtected.post(url, { ...payload });
  },
  updateComment(payload: types.UpdateCommentPayload) {
    const { name, ...rest } = payload;
    const url = `/keys/${name}`;
    return translatorProtected.patch(url, { ...rest });
  },
};
