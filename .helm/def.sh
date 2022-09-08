# ENVNAME 
#   prod - конфигурация "Продакшн", приложение смотрит на боевой сервер.
#   dev* - конфигурация для разработки, запускаются база и пгадмин 

export TAG=1.008
export APPNAME=translator
export NAMESPACE=translator

function dev()
{
	export ENVNAME=dev
	export CLUSTER_IP=$(kubectl cluster-info | grep -E -o "([0-9]{1,3}[\.]){3}[0-9]{1,3}" | head -1)
	export TLD="loc"
	export DOMAIN="mcn.loc"
	CI_URL="$APPNAME-$ENVNAME.$DOMAIN"
}

function stage()
{
	export ENVNAME=stage
	export CLUSTER_IP=$(kubectl cluster-info | grep -E -o "([0-9]{1,3}[\.]){3}[0-9]{1,3}" | head -1)
	export TLD="loc"
	export DOMAIN="mcn.loc"
	CI_URL="$APPNAME-$ENVNAME.$DOMAIN"
}

function preprod()
{
	export ENVNAME=stage
	export CLUSTER_IP=$IP_TO_ETCHOST
	export TLD="ru"
	export DOMAIN="mcn.ru"
	CI_URL="$APPNAME-$ENVNAME.$DOMAIN"
}

function spd1()
{
	export ENVNAME=spd1
	export CLUSTER_IP=$IP_TO_ETCHOST
	export TLD="ru"
	export DOMAIN="mcn.ru"
	CI_URL="$APPNAME-$ENVNAME.$DOMAIN"
}

function spd2()
{
	export ENVNAME=spd2
	export CLUSTER_IP=$IP_TO_ETCHOST
	export TLD="ru"
	export DOMAIN="mcn.ru"
	CI_URL="$APPNAME-$ENVNAME.$DOMAIN"
}

function prod()
{
	export ENVNAME=prod
	export DOMAIN="mcn.ru"
	export TLD="ru"
	CI_URL="$APPNAME.$DOMAIN"
}

function euprod()
{
	export ENVNAME=euprod
	export DOMAIN="kompaas.tech"
	export TLD="tech"
	export TLD_EU="tech"
	export CI_URL="$APPNAME.$DOMAIN"
}
