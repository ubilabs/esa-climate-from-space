// Returns the url template for offline usage
export function getOfflineStoryMediaUrl(): string {
  if (!window.cfs) {
    console.error('Calling electron function from a non-electron environment');
    return '';
  }

  return window.cfs.getDownloadsPath('downloads', '{id}');
}
