export TAG=1.103
export APPNAME=translator
export NAMESPACE=translator

function dev()
{
  export ENVNAME=dev
  export CLUSTER_IP=$(kubectl cluster-info | grep -E -o "([0-9]{1,3}[\.]){3}[0-9]{1,3}" | head -1)
  IP=$(hostname -I | awk '{print $1}');
  IP=$(echo "${IP##*.}")
  export TLD="ru"
  export DOMAIN="$IP.mcnloc.$TLD"
  export CI_URL="$APPNAME-$ENVNAME.$DOMAIN"
}

function stage()
{
  export ENVNAME=stage
  export TLD="ru"
  export DOMAIN="mcnloc.$TLD"
  export CI_URL="$APPNAME-$ENVNAME.$DOMAIN"
}

function spd()
{
  export ENVNAME=spd
  export TLD="ru"
  export DOMAIN="mcnspd.$TLD"
  export CI_URL="$APPNAME.$DOMAIN"
}

function prod()
{
  export ENVNAME=prod
  export TLD="ru"
  export DOMAIN="mcn.$TLD"
  export CI_URL="$APPNAME.$DOMAIN"
}

function euprod()
{
  export ENVNAME=euprod
  export TLD="tech"
  export DOMAIN="kompaas.$TLD"
  export CI_URL="$APPNAME.$DOMAIN"
}
