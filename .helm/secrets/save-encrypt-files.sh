#!/bin/bash

cd "./original";

for filename in $(find ./**/*.* -type f -and -not -name '*.sh' -not -name '.gitignore') ; do
  werf helm secret file encrypt $filename -o="../../secret/${filename}";
done
