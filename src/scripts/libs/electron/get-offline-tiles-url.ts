// Returns the url template for offline usage
export function getOfflineTilesUrl(): string {
  if (!window.cfs) {
    console.error('Calling electron function from a non-electron environment');
    return '';
  }

  return window.cfs.getDownloadsPath(
    '{id}',
    'tiles',
    '{timeIndex}',
    '{z}',
    '{x}',
    '{reverseY}.png'
  );
}
