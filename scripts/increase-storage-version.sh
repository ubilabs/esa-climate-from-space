#!/usr/bin/env bash
# Description:   Copy remote files to new version directory.
#                This script should be executed every time a new version is created.
# Usage: ./increase-storage-version <old_version> <new_version>
old=$1
new=$2

if [ $# -ne 2 ]
then
	echo "Error: You have to specify a old and new version number (e.g. increase-storage-version 0.9.3 1.0.0)"
fi

gsutil -m cp -r gs://esa-cfs-storage/$old/* gs://esa-cfs-storage/$new/
gsutil -m cp -r gs://esa-cfs-tiles/$old/* gs://esa-cfs-tiles/$new/
