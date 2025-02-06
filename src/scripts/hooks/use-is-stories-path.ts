import { useLocation } from "react-router-dom";

export default function useIsStoriesPath() {
  const { pathname } = useLocation();

  const isStoriesPath =
    pathname === "/stories" ||
    pathname === "/showcase" ||
    pathname === "/present";

  return isStoriesPath;
}
