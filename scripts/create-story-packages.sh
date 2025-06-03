#!/usr/bin/env bash

# Zip each story into a package in ./storage/stories/{storyId}package.zip
# The story content inside the package must be wrapped in a "story-{storyId}" folder
# Usage: Just run './scripts/create-story-package.sh' from the project's root directory

cd storage/stories

for storyId in */; do
  tmpDir=/tmp/$storyId
  mkdir $tmpDir

  cp -rf ./$storyId/* $tmpDir
  lastDir=(`pwd`)

  cd /tmp
  zip -r $lastDir/$storyId/package.zip ./$storyId
  cd $lastDir

  rm -rf $tmpDir
done
