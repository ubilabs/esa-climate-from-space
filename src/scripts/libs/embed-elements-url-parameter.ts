export function parseUrl(param: string): boolean | null {
  const {hash} = location;

  const queryString = hash.substr(hash.indexOf('?'));
  const urlParams = new URLSearchParams(queryString);
  const appElementParam = urlParams.get(param);

  if (appElementParam) {
    return appElementParam === 'true';
  }

  return null;
}
