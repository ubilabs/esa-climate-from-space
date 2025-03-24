import { useEffect, useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useHistory,
  useLocation,
  matchPath,
  useParams,
} from "react-router-dom";
import { setIsAutoRotating } from "../reducers/globe/auto-rotation";
import { setShowLayer } from "../reducers/show-layer-selector";
import { toggleEmbedElements } from "../reducers/embed-elements";
import { setSelectedLayerIds } from "../reducers/layers";
import { setFlyTo } from "../reducers/fly-to";
import config from "../config/main";
import { useScreenSize } from "./use-screen-size";

interface RouteParams {
  category: string | undefined;
}

/**
 * Path patterns used for route matching
 */
const ROUTE_PATTERNS = {
  basePath: { path: "/", exact: true },
  navPath: { path: "/:category", exact: true },
  dataPath: { path: "/:category/data", exact: true },
  storyPath: { path: "/:category/stories/:storyId" },
};

/**
 * Hook that manages globe state based on location changes
 * Handles auto-rotation functionality based on current route
 */
export function useGlobeLocationState() {
  const { category } = useParams<RouteParams>();
  const [showContentList, setShowContentList] = useState<boolean>(
    Boolean(category),
  );

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const previousPathnameRef = useRef(location.pathname);

  /**
   * Update auto-rotation state based on the current pathname
   */
  const updateAutoRotationState = useCallback(
    (isBasePath: boolean) => {
      // Only dispatch if needed to prevent unnecessary renders
      dispatch(setIsAutoRotating(isBasePath));
    },
    [dispatch],
  );

  /**
   * Match current path against known route patterns
   * Returns an object with all matching route results
   */
  const getRouteMatches = useCallback((pathname: string) => {
    return {
      basePath: matchPath(pathname, ROUTE_PATTERNS.basePath),
      navPath: matchPath(pathname, ROUTE_PATTERNS.navPath),
      dataPath: matchPath(pathname, ROUTE_PATTERNS.dataPath),
      storyPath: matchPath(pathname, ROUTE_PATTERNS.storyPath),
    };
  }, []);

  /**
   * Process pathname change, log route information, and update state
   */
  const handlePathnameChange = useCallback(
    (pathname: string, isFirstRender = false, isMobile: boolean ) => {
      // Only process if the pathname has actually changed or it's the first render
      if (pathname === previousPathnameRef.current && !isFirstRender) {
        return;
      }

      // Get and log all route matches
      const routeMatches = getRouteMatches(pathname);

      // Update auto-rotation state
      updateAutoRotationState(Boolean(routeMatches.basePath));

      if (routeMatches.basePath) {
        dispatch(setSelectedLayerIds({ layerId: null, isPrimary: true }));
        dispatch(setFlyTo(null));
        setShowContentList(false);
      }
      // Remove layer in NavContent mode when coming from the data page
      if (routeMatches.navPath) {
        setShowContentList(true);
        // This will only be triggered when the user is navigating back from /data page
        if (previousPathnameRef.current.endsWith("/data")) {
          dispatch(setShowLayer(false));
          dispatch(toggleEmbedElements({ legend: false, time_slider: false }));
          dispatch(setSelectedLayerIds({ layerId: null, isPrimary: false }));

          // reset gthe globe view
          dispatch(setFlyTo(config.globe.view));
        }
      }

      if (routeMatches.dataPath && !isMobile) {
        // As we use the CSS scale to increase the size of the canvas to make appear the globe bigger
        // If we don't want to re-mount the globe component AND keep the canvas size across the entire screen, what we do here is zoom out to make the globe appear smaller
        dispatch(
          setFlyTo({
            ...config.globe.view,
            altitude: config.globe.view.altitude * 2,
          }),
        );
      }
      // Store the current pathname for next comparison
      previousPathnameRef.current = pathname;
    },
    [dispatch, getRouteMatches, updateAutoRotationState],
  );

  const isMobile = useScreenSize().isMobile;
  useEffect(() => {
    const unlisten = history.listen((location) => {
      handlePathnameChange(location.pathname, false, isMobile);
    });

    return unlisten;
  }, [history, handlePathnameChange, isMobile]);

  // Handle initial state and direct URL changes
  useEffect(() => {
    // Pass true as second parameter to indicate this is potentially the first render
    handlePathnameChange(location.pathname, true, isMobile);
  }, [location.pathname, handlePathnameChange, isMobile]);

  return { showContentList };
}
