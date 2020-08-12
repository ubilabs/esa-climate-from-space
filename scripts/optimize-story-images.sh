#!/usr/bin/env bash

for dir in ./storage/stories/*/assets; do
    if [ -d "${dir}" ]; then
        echo "${dir}"
        npx imagemin $dir --out-dir=$dir
    fi
done
