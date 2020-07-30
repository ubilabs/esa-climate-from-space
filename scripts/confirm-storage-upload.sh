#!/usr/bin/env bash

echo ""
echo "*** Warning! ***"
echo ""
echo "Please commit your storage files first and check "
echo "if there are any differences between your local copy and the remote files!"
echo ""
echo "Write 'upload' to confirm uploading your files:"

read input

if  [ "$input" == "upload" ]; then
  echo 'ok'
  exit 0
else
  echo 'not ok'
  exit 1
fi
