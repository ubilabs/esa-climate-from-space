#!/usr/bin/env bash

set -euo pipefail

usage() {
    echo "Usage: $0 <folder-containing-images>" >&2
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

# Source extent: west -15, east 15, north 55, south 30.
# Target extent: west -11, east -2, north 43, south 38.
# The 9 by 5 degree target area is resized to a 16:9 output (1920 by 1080).
crop_filter="crop=w=iw*3/10:h=ih*1/5:x=iw*2/15:y=ih*12/25,scale=1920:1080:flags=lanczos"

input_dir=$(cd "$input_dir" && pwd -P)
output_dir="${input_dir}-16x9"
converted=0

mkdir -p "$output_dir"

while IFS= read -r -d '' input_file; do
    relative_path=${input_file#"$input_dir"/}
    relative_stem=${relative_path%.*}
    output_file="$output_dir/${relative_stem}_16x9.webp"

    mkdir -p "$(dirname "$output_file")"
    ffmpeg \
        -nostdin \
        -loglevel error \
        -y \
        -i "$input_file" \
        -frames:v 1 \
        -vf "$crop_filter" \
        -c:v libwebp \
        -preset picture \
        -quality 80 \
        -update 1 \
        "$output_file"

    echo "Converted: $relative_path"
    converted=$((converted + 1))
done < <(
    find "$input_dir" -type f \( \
        -iname '*.jpg' -o \
        -iname '*.jpeg' -o \
        -iname '*.tif' -o \
        -iname '*.tiff' -o \
        -iname '*.webp' \
    \) -print0
)

if [ "$converted" -eq 0 ]; then
    echo "No supported images found in '$input_dir'."
else
    echo "Converted $converted image(s) to '$output_dir'."
fi
