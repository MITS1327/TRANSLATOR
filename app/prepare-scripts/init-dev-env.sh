DIR=/workspace
cd $DIR

if ! [ -f $DIR/.gitclone ]; then
    echo "1. Clone repo"

    git clone git@gitlab.mcnloc.ru:platformav2/vpbx_team/translator.git \
    && touch $DIR/.gitclone \
    && cd translator/app \
    && npm ci \
    && npm i -g @nestjs/cli
fi
