<p align="center">
  <a href="http://mcn.ru/" target="blank"><img src="api/docs/assets/logo.svg" width="120" alt="MCN Logo" /></a>
</p>

# Translator

## Описание

Микросервис предназначен для взаимодейтвия фронтенда с pootle. Микросервис отдает измененные ключи фронтенду приложения. Микросервис работает с изменением ключей в реальном времени с фронтенда.

## Философия

Появление новых переводов в фронтенд части приложения без передеплоя
Изменения значений ключей в реальном времени

## Документация

1. [Swagger](https://translator.mcn.ru/api/swagger)
2. [Docs](https://translator.mcn.ru/docs/)
3. [Описание сервиса (github)](app/README.md)
4. [Установка сервиса (github)](docs/INSTALL.md)
5. [Использование (github)](docs/USAGE.md)
6. [Концепция работы микросервиса (github)](docs/ALGORITHMS.md)

---

| Название ИС | Мнемоника  |
| ----------- | ---------- |
| MCN telecom | **04XJ01** |

---

## Необходимо организовать работу со следующими сведениями.

### Требования к сервису

1. Аутентификация пользователей сервиса (Другие микросервисы MCN Telecom, сотрудники кмопании MCN Telecom, клиенты MCn Telecom)
2. Хранение словарей в редисе
3. Изменение значений ключей в реальном времени
4. Без надобности не отправлять переводы на фронтенд

### Потребитель

1. Аутентификация микросервиса c помощью куки mcn_uid
2. Хранение ключей в local storage после получения переводов
3. Совмещение переводов, которые пришли и переводов, которые были задеплоены
