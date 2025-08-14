import { autoLng } from "../components/main/embed-settings/embed-settings";
import { ElementOptions } from "../types/embed-elements";

export const createEmbedUrl = (uiElementsChecked: ElementOptions): string => {
  const { origin, pathname, hash } = window.location;
  // Parse the current hash query string
  // Split hash into path and query string
  const [hashPath, queryString = ""] = hash.split("?");
  const params = new URLSearchParams(queryString);

  // Remove params from URL that are not the globe
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
      if (key === "lng") {
        // Skip language key, it will be handled separately
        return;
      }
      params.set(key, "false");
    });
  }

  // Handle the language parameter
  const language = uiElementsChecked.lng as string;

  if (language === autoLng) {
    params.delete("lng");
  } else if (language && language.length > 0) {
    params.set("lng", language);
  }

  // Rebuild the new hash part
  const queryParams = params.toString();

  const newHash = queryParams ? `${hashPath}?${queryParams}` : hashPath;

  // Construct and return full updated URL
  return origin + pathname + newHash;
};
