# Использование микросервиса

Все методы и их описание можно найти в [Swagger](https://translator.mcn.ru/api/swagger)

## Аутентификация

### Браузерный клиент

Необходима авторизация в личном кабинете и передавать куку ```mcn_uid```

### Другие микросервисы

Необходимо находится внутри корпороративной сети


## Работа на фронте

1. обновить вебпак до 5 версии(package.json и измененные конфиги можно взять с проекта services)
2. добавить в конфиги вебпака:
```ts
  experiments: {
    topLevelAwait: true
  }
```
3. добавить прокси translatorapi в devServer
4. если есть typescript на проекте, то добавить в tsconfig.json:
```json
"target": "es2022",
"module": "es2022",
```
5. добавить переменную translator в environments/index
```ts
translator: IS_DEV ? `${window.location.origin}/translatorapi/public` : `${translatorDomain}/api/public`,
```
6. дополнить api

```ts
const translator = instanceWithOptions({
  baseURL: environments.api.translator,
});

export const apiTranslator = {
  getDicts(payload: types.GetDictsParams) {
    const url = '/translates/dicts';
    return translator.get(url, { params: payload, timeout: 1500 });
  },
};
```
6. изменить index.tsx или index.js в src
https://github.com/welltime/services/pull/129/files#diff-7bf372cb5724e2be1ffb4cb558203169c5a6c585715d5b9dfe57e95efc1ad130
dictProjectParams - поменять project на название своего проекта:

'services, 'base','chatbots', 'integration',
'telephony', 'robocall', mcn-ui-components'


Пример пулла работы с микросервисом на фронтенде: https://github.com/welltime/services/pull/129
