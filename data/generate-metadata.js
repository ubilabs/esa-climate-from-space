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

// get the number of zoom levels by counting the <TileSet> tags in the tilemapresource.xml file
const tileMapResource = fs.readFileSync(
  path.join(__dirname, `../tmp/tiles/${variableId}/0/tilemapresource.xml`),
  'utf8'
);
const zoomLevels = tileMapResource.match(/<TileSet\s/g).length;

// get the tiles metadata
const tiles = require(path.join(
  __dirname,
  `../tmp/tiles/${variableId}/metadata.json`
));
const timestamps = tiles.coordinates.time;
const metadata = {
  ...layer,
  id: layerId,
  zoomLevels,
  timestamps
};

fs.writeFileSync('./tmp/new-metadata.json', JSON.stringify(metadata, null, 2));
