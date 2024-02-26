#!/bin/bash

THIS=`readlink -f "${BASH_SOURCE[0]}"`
DIR=`dirname "${THIS}"`
cd $DIR

rm -rf .werf/tmp/id_rsa
rm -rf .werf/tmp/.pgpass

source ./def.sh

if [ "$ENVNAME" = "dev" ]; then
    cat << EOF
    ================================================
    Проект $APPNAME задеплоен в $ENVNAME окружение
    Чтобы запустить этот nodejs, надо вбить npm run start как обычно из папки /workspace/$APPNAME/app
    В вебе этот бекенд отвечает по uri /api/"
    ================================================
EOF
fi
