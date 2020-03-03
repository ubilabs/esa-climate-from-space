// Generates a new metadata file from xcube timestamps and our layer config
// run with 'node generate-metadata.js {layerId}'

const fs = require('fs');
const path = require('path');
const layers = require(path.join(__dirname, './layers-config.json'));

const id = process.argv[2];
const layer = layers[id];

if (!id || !layer) {
  throw new Error('No valid layer id defined!');
}

const tiles = require(path.join(__dirname, `../tmp/tiles/${id}/metadata.json`));
const timestamps = tiles.coordinates.time;
const metadata = {
  ...layer,
  timestamps
};

fs.writeFileSync('./tmp/new-metadata.json', JSON.stringify(metadata, null, 2));
