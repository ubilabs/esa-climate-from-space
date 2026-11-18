#!/usr/bin/env bash
# Upload a finished layer from the Airflow workdir to the tiles bucket, outside of Airflow.
#
# Use this when the DAG's upload.gcloud_upload task keeps getting interrupted (sleep, network).
# It runs `gcloud storage rsync`, which skips files that are already in the bucket, and retries
# automatically until everything is uploaded. Rerunning it later also continues where it stopped.
#
# Usage: ./upload-layer.sh <layer_id.variable> [layer_version] [bucket]
# Example: ./upload-layer.sh vegetation.lai 2.1.5 esa-cfs-tiles
#
# Prerequisites: the DAG's upload.prepare_upload task has succeeded (workdir/files/upload exists),
# you are logged in with `gcloud auth login`, and the Mac is on power with the lid open.

set -uo pipefail

LAYER=${1:?Usage: $0 <layer_id.variable> [layer_version] [bucket]}
VERSION=${2:-$(node -p "require('$(dirname "$0")/../package.json').version" 2>/dev/null)}
BUCKET=${3:-esa-cfs-tiles}
SOURCE="$(cd "$(dirname "$0")" && pwd)/workdir/files/upload"
DESTINATION="gs://$BUCKET/$VERSION/$LAYER"
MAX_ATTEMPTS=${MAX_ATTEMPTS:-50}

if [ -z "$VERSION" ]; then
  echo "Could not determine the layer version; pass it as the second argument." >&2
  exit 1
fi
if [ ! -f "$SOURCE/metadata.json" ] || [ ! -d "$SOURCE/tiles" ]; then
  echo "$SOURCE is incomplete; run the DAG's prepare_upload task first." >&2
  exit 1
fi
if ! grep -q "\"$LAYER\"" "$SOURCE/metadata.json"; then
  echo "$SOURCE/metadata.json does not belong to $LAYER; aborting." >&2
  exit 1
fi

echo "Uploading $SOURCE"
echo "       -> $DESTINATION"

for attempt in $(seq 1 "$MAX_ATTEMPTS"); do
  echo "=== Attempt $attempt/$MAX_ATTEMPTS ($(date '+%Y-%m-%d %H:%M:%S'))"
  # --delete-unmatched-destination-objects removes leftovers of an older layer version,
  # like the DAG's upload task.
  if caffeinate -i gcloud storage rsync --recursive --delete-unmatched-destination-objects \
      "$SOURCE" "$DESTINATION"; then
    echo "=== Upload complete ($(date '+%Y-%m-%d %H:%M:%S'))"
    exit 0
  fi
  echo "=== Interrupted; retrying in 60 seconds (already uploaded files are skipped)" >&2
  sleep 60
done

echo "Giving up after $MAX_ATTEMPTS attempts; rerun the script to continue." >&2
exit 1
