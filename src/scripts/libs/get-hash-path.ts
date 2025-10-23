// Extracts the hash path from the URL, defaulting to "/" if not present
// This utility extracts the hash path from the URL, defaulting to "/" if not present.
// While similar behavior can be achieved using `location.pathname` in React Router,
// this function is useful when React Router context is unavailable or not applicable.
export const getHashPathName = (): string => {
  const [, hashPath = "/"] = window.location.href.split("#");
  return hashPath || "/";
};
