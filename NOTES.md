# detailed cesium API usage

## `components/globe.tsx`

- create and configure globe
- configure event-handling
- toggle 2d/3d (via `props.projectionState`)
- handle external view-state changes coming from other globe (sync)
- setup basemap from `props.layerDetails`
- trigger flyTo (via props.flyTo)
- initiate automatic spinning (via `props.spinning`)
- wait for tiles being loaded (react-state `firstTilesLoaded`)

- calls `useGlobeLayer()`
- calls `useMarkers()` (marker-data from props)

- ATTN: defines viewport in 6DoF position (lla) and orientation, check if
  something other than orientation towards center is needed.

- knowledge of actual timestamp, available timestamps etc is (exclusively) outside the Globe component
- incoming layers: props.imageLayer contains current url (pattern) with
  the timestamp already inserted `props.imageLayer.url === '.../tiles/5/{z}/{x}/{reverseY}.png'`
- basemap is essentially encoded in a single property
  `props.layerDetails.basemap === 'land'`

### usage

## `hooks/use-globe-layer.ts`

- exclusively called by the Globe component

- creates imagery providers and layer from layer-specification
- waits for layer to be ready and adds it to cesium viewer

## `hooks/use-markers.ts`

- exclusively called by the Globe component

- waits for cesium viewer and tiles being loaded before adding / showing markers
- uses create-marker.ts to actually create the markers.
- This should be mostly obsolete with the new marker implementation.

## `libs/create-marker.ts`

- exclusively called by the useMarkers hook

## `libs/download-screenshot.ts`

- (only uses the `.cesium-viewer` css class to find canvas-elements)

## `libs/get-globe-view.ts`

- exclusively called by the Globe component

- functions to convert between `GlobeView` (position/orientation) and cesium internal formats.
