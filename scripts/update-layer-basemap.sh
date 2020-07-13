# Updates the basemap property in a layers metadata.json
# Usage: ./scripts/updae-layer-basemap.sh <layerId> <newBasemap>

id=$1
basemap=$2
path=gs://esa-cfs-tiles/0.6.1/$id/metadata.json

gsutil cp $path ./download/

replace=".basemap = \"$basemap\""
jq "$replace" ./download/metadata.json | gsutil cp - $path
