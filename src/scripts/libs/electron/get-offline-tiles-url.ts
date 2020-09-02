import {LayerType} from '../../types/globe-layer-type';

// Returns the url template for offline usage
export function getOfflineTilesUrl(type: LayerType): string {
  if (!window.cfs) {
    console.error('Calling electron function from a non-electron environment');
    return '';
  }

  return {
    [LayerType.Tiles]: window.cfs.getDownloadsPath(
      'downloads',
      '{id}',
      'tiles',
      '{timeIndex}',
      '{z}',
      '{x}',
      '{reverseY}.png'
    ),

    [LayerType.Image]: window.cfs.getDownloadsPath(
      'downloads',
      '{id}',
      'tiles',
      '{timeIndex}',
      'full.png'
    ),

    [LayerType.Gallery]: window.cfs.getDownloadsPath(
      'downloads',
      '{id}',
      'tiles',
      '{timeIndex}',
      'full.jpg'
    )
  }[type];
}
