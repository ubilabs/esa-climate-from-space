// Starts a download with the given url
export function downloadUrl(url: string): void {
  if (!window.cfs) {
    console.error('Calling electron function from a non-electron environment');
    return;
  }

  window.cfs.downloadUrl(url);
}
