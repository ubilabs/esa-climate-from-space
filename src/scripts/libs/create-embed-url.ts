import { ElementOptions } from "../types/embed-elements";

export const createEmbedUrl = (uiElementsChecked: ElementOptions): string => {
  const { origin, pathname, hash } = window.location;
  // Parse the current hash query string
  // Split hash into path and query string
  const [hashPath, queryString = ""] = hash.split("?");
  const params = new URLSearchParams(queryString);

  //Remvoe params from URL that are not the globe
  for (const key of Array.from(params.keys())) {
    if (key !== "globe") {
      params.delete(key);
    }
  }

  // Get all unchecked keys (falsy values)
  const uncheckedKeys = Object.keys(uiElementsChecked).filter(
    (key) => !uiElementsChecked[key as keyof ElementOptions],
  );

  // Add unchecked keys to params with value "false"
  if (uncheckedKeys.length) {
    uncheckedKeys.forEach((key) => {
      params.set(key, "false");
    });
  }

  // Rebuild the new hash part
  const newHash = `${hashPath}${params.toString() ? `?${params.toString()}` : ""}`;

  // Construct and return full updated URL
  return `${origin}${pathname}${newHash}`;
};
