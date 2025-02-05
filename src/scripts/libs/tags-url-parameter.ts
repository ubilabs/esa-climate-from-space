const char = "I";

// parses window.location and reads the story tags from query params
//
// note: we do not use the location.search prop here because the HashRouter
// stores the query parameters in the location.hash prop
export function parseUrl(): string[] {
  const { hash } = location;
  // only take the query portion of the hash string
  const queryString = hash.substr(hash.indexOf("?"));
  const urlParams = new URLSearchParams(queryString);
  const tagsParam = urlParams.get("tags");

  if (!tagsParam) {
    return [];
  }

  return tagsParam.split(char);
}

export function getParamString(tags: string[]): string | null {
  if (tags.length === 0) {
    return null;
  }

  return tags.join(char);
}
