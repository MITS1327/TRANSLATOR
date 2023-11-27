# Алгоритмы работы микросервиса

## Authentication

Для аутентификации микросервиса в translator используется аутентификация через ingress продукта <a href="https://github.com/welltime/base">base</a>

## Redis

Формат хранения данных в redis:
```json
"pootle_product_name": {
  "hash": "237fn34fedwpfhhge2",
  "filesData": {
    "ru_RU": {
      "key": "value"
    }
  }
}
```

Важно учитывать, что если скинуть кэш редиса, то все переводы которые пришли пропадут, их  можно легко восстановиться если поменять ключи в путле

## Передача переводов на фронт

<p align="center">
  <a href="https://miro.com/app/board/uXjVPPYnFjw=/">Image link</a>
  <img src="../assets/algorithm.png" width="100%" alt="Algorithm" />
  </a>
</p>

## Мгновенные переводы в pootle

Необходимо вызвать следующий метод:
```
curl -X 'POST' \
  'https://translator.mcn.ru/api/public/translates/key' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
    "key": "string",
    "value": "string"
}'
```

## Мониторинг pootle
Механизм мониоринга языковых файлов путла работает таким образом, что клиент запрашивает следующие данные: 
[DTO](/docs/classes/GetNotTranslatedDictsDTO.html)

Сервис проверяет, если ключ совпадает со значением, то тогда ключ явялется непереведенным.
