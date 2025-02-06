#!/bin/bash

# Find all .styl files in src/ and subdirectories
find ./src -type f -name "*.styl" | while read file; do
  # Compile each .styl file to a .css file
  npx stylus "$file" -o "$(dirname "$file")"
  echo "Compiled: $file"
done
