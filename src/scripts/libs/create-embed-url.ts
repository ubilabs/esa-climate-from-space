export const createEmbedUrl = (paramsString: string) => {
  const currentUrl = window.location.href;

  if (paramsString.length === 0) {
    return currentUrl;
  } else if (currentUrl.includes('?')) {
    return `${currentUrl}&${paramsString}`;
  }

  return `${currentUrl}?${paramsString}`;
};
