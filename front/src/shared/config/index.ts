import getUrl from 'mcn-ui-components/api/baseurl';

const getDomain = (product: string): string => getUrl(window.location.hostname, product);

export const IS_EU_PROD = EnvName === 'euprod';
export const IS_DEV = window.location.origin.includes('127.0.0.1') || window.location.origin.includes('localhost');

export const API_DOMAINS = {
  domen: `${window.location.origin}/phone/app`,
  core: IS_DEV ? `${window.location.origin}/core` : `${getDomain('lk')}/core`,
  vpbxv5: IS_DEV ? `${window.location.origin}/vpbxv5` : `${getDomain('vpbx')}/vpbxv5`,
  vats: IS_DEV ? `${window.location.origin}/api/protected/vpbx` : `${getDomain('vpbx')}/api/protected/vpbx`,
  phone: IS_DEV ? `${window.location.origin}/phone` : `${getDomain('vpbx')}/phone`,
  telephony: IS_DEV ? `${window.location.origin}/api/protected/phone` : `${getDomain('vpbx')}/api/protected/phone`,
  equipment: IS_DEV
    ? `${window.location.origin}/equipmentapi/protected/equipment`
    : `${getDomain('vpbx')}/api/protected/equipment`,
  base: IS_DEV ? `${window.location.origin}/baseapi/protected/api/` : `${getDomain('base')}/api/protected/api/`,
  api: `${window.location.origin}/api/protected/api`,
  superset: IS_DEV ? `${window.location.origin}/supersetapi/` : 'https://superset-prod.mcn.ru/',
  translator: IS_DEV ? `${window.location.origin}/translatorapi/public` : `${getDomain('translator')}/api/public`,
  translatorProtected: IS_DEV
    ? `${window.location.origin}/translatorapi/protected`
    : `${getDomain('translator')}/api/protected`,
  references: IS_DEV ? `${window.location.origin}/referencesapi/protected` : `${getDomain('references')}/api/protected`,
  addressbook: IS_DEV
    ? `${window.location.origin}/addressbookapi/protected`
    : `${getDomain('addressbook')}/api/protected`,
  services: IS_DEV ? `${window.location.origin}/servicesapi` : `${getDomain('services')}/api`,
  billing: IS_DEV ? `${window.location.origin}/apigw` : `${window.location.origin}/api`,
  topbar: IS_DEV ? `${window.location.origin}/topbar` : `${getDomain('topbar')}`,
  users: IS_DEV ? `${window.location.origin}/api/protected/users` : `${getDomain('vpbx')}/api/protected/users`,
};
