// Generates a new metadata file from xcube timestamps and our layer config
// run with 'node generate-metadata.js {variableId} {layerId}'

const fs = require('fs');
const path = require('path');
const layers = require(path.join(__dirname, './layers-config.json'));

const variableId = process.argv[2];
const layerId = process.argv[3];
const layer = layers[layerId];

if (!variableId || !layerId || !layer) {
  throw new Error('No valid layer or variable Id defined!');
}

const tiles = require(path.join(
  __dirname,
  `../tmp/tiles/${variableId}/metadata.json`
));
const timestamps = tiles.coordinates.time;
const metadata = {
  ...layer,
  timestamps
};

fs.writeFileSync('./tmp/new-metadata.json', JSON.stringify(metadata, null, 2));
