set -e

DIR=/workspace
cd $DIR

[ ! -d translator ] &&
    git clone git@github.com:welltime/translator.git --branch master || true
cd translator/api && npm i && npm i -g @nestjs/cli && npm run build
