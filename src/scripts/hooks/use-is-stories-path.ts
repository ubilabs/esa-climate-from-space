import { useLocation } from "react-router-dom";

export default function useIsStoriesPath() {
  const { pathname } = useLocation();

  const isStoriesPath =
    pathname.includes("stories") ||
    pathname === "/showcase" ||
    pathname === "/present";

  return isStoriesPath;
}
