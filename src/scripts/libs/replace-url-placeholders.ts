type ValueMap = {
  [key: string]: string;
};

const MATCH_PLACEHOLDERS = /{\w+}/g;

/**
 * Replaces all url occurences of '{key}' with the provided values
 */
export function replaceUrlPlaceholders(url: string, values: ValueMap): string {
  const matches = url.match(MATCH_PLACEHOLDERS);

  if (!matches) {
    return url;
  }

  matches.forEach((match) => {
    // remove {} to get key
    const key = match.replace(/{|}/g, "");
    // get value for this key
    const value = values[key];

    // do nothing if no value for this key is provided
    if (!value) {
      return;
    }

    // replace all placeholders for this key in the url with the value
    const regex = new RegExp(`{${key}}`, "g");
    url = url.replace(regex, value);
  });

  return url;
}
