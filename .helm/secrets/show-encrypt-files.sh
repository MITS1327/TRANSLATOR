#!/bin/bash

rm -rf ./original/;
mkdir ./original/;

for filename in $(find ../secret/**/*.* -type f -and -not -name '*.sh' -not -name '.gitignore') ; do
  mapped_filename="${filename//..\/secret\//}";
  werf helm secret file decrypt $filename -o="./original/${mapped_filename}"
done
