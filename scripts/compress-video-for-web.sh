#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: ./scripts/compress-video-for-web.sh <input-video> [output-dir] [target-size-mb]

Creates two web-friendly outputs:
  - <name>-web.mp4  (H.264/AAC, faststart enabled)
  - <name>-web.webm (VP9/Opus)

Arguments:
  input-video      Source video file
  output-dir       Directory for outputs (defaults to input file directory)
  target-size-mb   Approximate size target for each output (defaults to 4)

Requires:
  ffmpeg
  ffprobe
EOF
}

require_tool() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required tool: $1" >&2
    exit 1
  fi
}

if [[ $# -lt 1 || $# -gt 3 ]]; then
  usage
  exit 1
fi

require_tool ffmpeg
require_tool ffprobe

input_file="$1"
output_dir="${2:-$(dirname "$input_file")}"
target_size_mb="${3:-4}"

if [[ ! -f "$input_file" ]]; then
  echo "Input file not found: $input_file" >&2
  exit 1
fi

if ! [[ "$target_size_mb" =~ ^[0-9]+([.][0-9]+)?$ ]]; then
  echo "Target size must be a positive number of megabytes." >&2
  exit 1
fi

mkdir -p "$output_dir"

base_name="$(basename "$input_file")"
stem="${base_name%.*}"
mp4_output="$output_dir/${stem}-web.mp4"
webm_output="$output_dir/${stem}-web.webm"

duration_seconds="$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$input_file")"

if [[ -z "$duration_seconds" ]]; then
  echo "Could not determine input duration." >&2
  exit 1
fi

audio_kbps=96
min_video_kbps=250
scale_filter="scale=1280:720:force_original_aspect_ratio=decrease:force_divisible_by=2"

target_total_kbps="$(awk -v mb="$target_size_mb" -v secs="$duration_seconds" 'BEGIN {
  if (secs <= 0) {
    print 0
  } else {
    printf "%.0f", (mb * 8192 * 0.96) / secs
  }
}')"

video_kbps=$((target_total_kbps - audio_kbps))

if (( video_kbps < min_video_kbps )); then
  echo "Warning: requested size is very small for this duration; using minimum video bitrate of ${min_video_kbps}k." >&2
  video_kbps=$min_video_kbps
fi

maxrate_kbps=$((video_kbps * 2))
bufsize_kbps=$((video_kbps * 4))

temp_dir="$(mktemp -d "${TMPDIR:-/tmp}/compress-video.XXXXXX")"
trap 'rm -rf "$temp_dir"' EXIT

mp4_passlog="$temp_dir/mp4-pass"
webm_passlog="$temp_dir/webm-pass"

echo "Compressing $input_file"
echo "Target size per output: ${target_size_mb} MB"
echo "Video bitrate: ${video_kbps}k"

ffmpeg -y -i "$input_file" \
  -map 0:v:0 \
  -vf "$scale_filter" \
  -c:v libx264 \
  -preset slow \
  -profile:v high \
  -pix_fmt yuv420p \
  -b:v "${video_kbps}k" \
  -maxrate "${maxrate_kbps}k" \
  -bufsize "${bufsize_kbps}k" \
  -pass 1 \
  -passlogfile "$mp4_passlog" \
  -an \
  -f mp4 /dev/null

ffmpeg -y -i "$input_file" \
  -map 0:v:0 \
  -map 0:a? \
  -vf "$scale_filter" \
  -c:v libx264 \
  -preset slow \
  -profile:v high \
  -pix_fmt yuv420p \
  -b:v "${video_kbps}k" \
  -maxrate "${maxrate_kbps}k" \
  -bufsize "${bufsize_kbps}k" \
  -pass 2 \
  -passlogfile "$mp4_passlog" \
  -c:a aac \
  -b:a "${audio_kbps}k" \
  -ac 2 \
  -movflags +faststart \
  "$mp4_output"

ffmpeg -y -i "$input_file" \
  -map 0:v:0 \
  -vf "$scale_filter" \
  -c:v libvpx-vp9 \
  -row-mt 1 \
  -deadline good \
  -cpu-used 2 \
  -b:v "${video_kbps}k" \
  -crf 34 \
  -pass 1 \
  -passlogfile "$webm_passlog" \
  -an \
  -f webm /dev/null

ffmpeg -y -i "$input_file" \
  -map 0:v:0 \
  -map 0:a? \
  -vf "$scale_filter" \
  -c:v libvpx-vp9 \
  -row-mt 1 \
  -deadline good \
  -cpu-used 2 \
  -b:v "${video_kbps}k" \
  -crf 34 \
  -pass 2 \
  -passlogfile "$webm_passlog" \
  -c:a libopus \
  -b:a "${audio_kbps}k" \
  "$webm_output"

echo "Created: $mp4_output"
echo "Created: $webm_output"
