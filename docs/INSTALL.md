Установка

## Deploy minikube

1. Перейти в директорию minikube

```bash
$ cd kube_ci/minikube_dev
```

2. Добавить translator в productlist и выбрать тип поднимаемого окружения (dev, stage, prod, euprod):

```
PRODUCTS=(
  ...
  [translator]=dev
)
```

3. Запустить деплой приложения:

```bash
$ ./00-build-deploy.sh translator
```

4. Открываем запущенный под в VS Code - translator-api-0

5. Переходим в рабочую директорию внутри пода:

```bash
$ cd workspace/translator/app/
```

## Installation

```bash
$ npm install
# install husky
$ npm run prepare
```

## Running the app

```bash
# development
$ npm run start
# watch mode
$ npm run start:dev
# production mode
$ npm run start:prod
```

## Linter

```bash
# lint project
$ npm run lint
# lint fix
$ npm run lint:fix
# prettier check project
$ npm run prettier
# prettier fix project
$ npm run prettier:fix
```

## Type coverage

```bash
# generate type coverage page
$ npm run type-coverage
# print type coverage table to console
$ npm run type-coverage:console
```

Для форматирования кода при нажатии комбинации ctrl + S необходимо добавить в `.vscode/settings.json` следующие свойства:

```json
"editor.codeActionsOnSave": {
"source.fixAll.eslint": true
},
"eslint.validate": ["javascript"]
```
