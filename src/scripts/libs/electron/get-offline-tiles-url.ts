import {GlobeLayerType} from '../../types/globe-layer-type';

// Returns the url template for offline usage
export function getOfflineTilesUrl(type: GlobeLayerType): string {
  if (!window.cfs) {
    console.error('Calling electron function from a non-electron environment');
    return '';
  }

  return type === GlobeLayerType.Tiles
    ? window.cfs.getDownloadsPath(
        'downloads',
        '{id}',
        'tiles',
        '{timeIndex}',
        '{z}',
        '{x}',
        '{reverseY}.png'
      )
    : window.cfs.getDownloadsPath(
        'downloads',
        '{id}',
        'tiles',
        '{timeIndex}',
        'full.png'
      );
}
