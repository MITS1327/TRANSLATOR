# Отказоустойчивость микросервиса

На данный момент сервис получает около 125 запросов в секунду в среднем.

Ссылки на проверку актуальности данных:

[![Grafana](https://img.shields.io/badge/-Grafana-000?&logo=grafana)](https://monitoring.mcn.ru/d/zN0faEaMz/ingress-nginx-daemonset-overview?orgId=1&var-datasource=Prometheus-1-Federate_prod2&var-node=All&var-host=translator.mcn.ru&var-path=All&var-pod=All&from=1670965200000&to=1671051599000)

[![Kibana](https://img.shields.io/badge/-Kibana-000?&logo=kibana)](https://kibana-k8s-prod2.mcn.ru/app/discover#/view/57d76ab0-3624-11eb-ad9e-c97a024fad82?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now%2Fw,to:now%2Fw))&_a=(columns:!(log_duration),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:fa5f0aa0-3623-11eb-ad9e-c97a024fad82,key:kubernetes.labels.app_kubernetes_io%2Finstance,negate:!f,params:(query:ingress-nginx),type:phrase),query:(match_phrase:(kubernetes.labels.app_kubernetes_io%2Finstance:(query:ingress-nginx)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:fa5f0aa0-3623-11eb-ad9e-c97a024fad82,key:log_vhost,negate:!f,params:(query:translator.mcn.ru),type:phrase),query:(match_phrase:(log_vhost:translator.mcn.ru)))),index:fa5f0aa0-3623-11eb-ad9e-c97a024fad82,interval:s,query:(language:lucene,query:''),sort:!(!('@timestamp',desc),!(log_duration,asc))))

## Нагрузочное тестрование

Тестирование проводилось в утилите:

[![Apache Jmeter](https://img.shields.io/badge/-Jmeter-000?&logo=apachejmeter)](https://jmeter.apache.org/usermanual/get-started.html)

<a href="../assets/report.jmx">Конфиг Jmeter</a>

Нагрузка была размернойстью в 1000 заросов в секунду, сильных отклонений от нормы обработки запроса микросервисом не было найдено.

## Как расширять микросервис

Сейчас в prod-окружениие работает всего одна репликация пода сервера, в зависимости от дальнейшей нагрузки можно увеличить количество репликаций.

## Узкие места микросервиса
При огромной нагрузки на сервер узким местом является то, что микросервис работает на Node.js, что не особо подходит для высоконагруженных приложений