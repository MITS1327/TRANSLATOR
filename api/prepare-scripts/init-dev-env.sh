DIR=/workspace
cd $DIR

if ! [ -f $DIR/.gitclone ]; then
    echo "1. Clone repo"

    git clone git@gitlab.mcnloc.ru:platformav2/vpbx_team/translator.git \
    && touch $DIR/.gitclone \
    && cd translator/api \
    && npm i \
    && npm i -g @nestjs/cli \
    && npm i -g npm-check-updates \
    && npm run build
fi