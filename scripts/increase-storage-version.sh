#!/usr/bin/env bash
# Description:   Copy remote files to new version directory.
#                This script should be executed every time a new version is created.
# Usage: ./increase-storage-version <old_version> <new_version>
old=$1
new=$2

if [ $# -ne 2 ]
then
	echo "Error: You have to specify a old and new version number (e.g. increase-storage-version 0.9.3 1.0.0)"
	exit 1
fi

gcloud storage cp --recursive "gs://esa-cfs-storage/$old/*" "gs://esa-cfs-storage/$new/"
gcloud storage cp --recursive "gs://esa-cfs-tiles/$old/*" "gs://esa-cfs-tiles/$new/"

echo "Done: version $old successfully copied to $new in esa-cfs-storage and esa-cfs-tiles."
