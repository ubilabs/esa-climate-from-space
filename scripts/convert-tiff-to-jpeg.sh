#!/usr/bin/env bash

set -euo pipefail

usage() {
    echo "Usage: $0 <folder-containing-tiff-images>" >&2
}

if [ "$#" -ne 1 ]; then
    usage
    exit 2
fi

input_dir=${1%/}

if [ ! -d "$input_dir" ]; then
    echo "Error: '$1' is not a directory." >&2
    exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
    echo "Error: FFmpeg is required (the 'ffmpeg' command was not found)." >&2
    exit 1
fi

input_dir=$(cd "$input_dir" && pwd -P)
output_dir="${input_dir}-jpeg"
converted=0

mkdir -p "$output_dir"

while IFS= read -r -d '' input_file; do
    relative_path=${input_file#"$input_dir"/}
    relative_stem=${relative_path%.*}
    output_file="$output_dir/$relative_stem.jpg"

    mkdir -p "$(dirname "$output_file")"
    ffmpeg \
        -loglevel error \
        -y \
        -i "$input_file" \
        -frames:v 1 \
        -q:v 2 \
        -update 1 \
        "$output_file"

    echo "Converted: $relative_path"
    converted=$((converted + 1))
done < <(find "$input_dir" -type f \( -iname '*.tif' -o -iname '*.tiff' \) -print0)

if [ "$converted" -eq 0 ]; then
    echo "No TIFF images found in '$input_dir'."
else
    echo "Converted $converted image(s) to '$output_dir'."
fi
