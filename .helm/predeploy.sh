#!/bin/bash

. $(multiwerf use 1.2 stable --as-file)

THIS=`readlink -f "${BASH_SOURCE[0]}"`
DIR=`dirname "${THIS}"`
cd $DIR
mkdir -p tmp
cp -f ~/.ssh/id_rsa tmp/id_rsa-vcs
