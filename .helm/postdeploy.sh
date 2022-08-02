#!/bin/bash

THIS=`readlink -f "${BASH_SOURCE[0]}"`
DIR=`dirname "${THIS}"`
cd $DIR

source ./def.sh

if [ "$ENVNAME" = "dev" ]; then
    API_POD="$APPNAME-api-0"
    API_CONT="$APPNAME-api"
    NAMESPACE="$NAMESPACE-$ENVNAME"
    CMD="-- /bin/bash /install/prepare-scripts/init-dev-env.sh"

    echo "Ожидание готовности пода $API_POD" &&
        kubectl -n $NAMESPACE wait --for=condition=ready --timeout=120s pods $API_POD
    echo 'Запуск скрипта инициализации' &&
        kubectl -n $NAMESPACE exec -it $API_POD -c $API_CONT $CMD
    cat << EOF
    ================================================
    Проект $APPNAME задеплоен в $ENVNAME окружение
    Чтобы запустить этот nodejs, надо вбить npm run start как обычно из папки /workspace/translator/api
    В вебе этот бекенд отвечает по uri /api/"
    ================================================
EOF
fi
