import { useEffect, useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { setSelectedContentAction } from "../reducers/content";
import { selectedLayerIdsSelector } from "../selectors/layers/selected-ids";
import { languageSelector } from "../selectors/language";
import { useGetLayerListQuery } from "../services/api";

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
  const [showDataSet, setShowDataSet] = useState<boolean>(false);

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const previousPathnameRef = useRef<string | null>(null);

  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  const { mainId } = selectedLayerIds;
  const language = useSelector(languageSelector);
  const { data: layers } = useGetLayerListQuery(language);

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
    (pathname: string, isMobile: boolean) => {
      // Only process if the pathname has actually changed or it's the first render
      if (
        // null on first render
        previousPathnameRef.current &&
        pathname === previousPathnameRef.current
      ) {
        return;
      }

      setShowDataSet(false);

      // Get and log all route matches
      const routeMatches = getRouteMatches(pathname);

      // Update auto-rotation state
      updateAutoRotationState(Boolean(routeMatches.basePath));

      if (routeMatches.basePath) {
        // On first load try to select data layer if set via URL params.
        // This is needed to ensure backward compatibility with CfS < 2.0
        if (!previousPathnameRef.current) {
          const layerId = selectedLayerIds?.mainId;
          const layer = layers?.find((layer) => layer.id === layerId);

          if (layer && layer.categories?.length) {
            dispatch(setSelectedLayerIds({ layerId, isPrimary: true }));
            history.replace(`/${layer.categories[0]}/data`);
          }
        } else {
          dispatch(setSelectedLayerIds({ layerId: null, isPrimary: true }));
          dispatch(setFlyTo(null));
          dispatch(setSelectedContentAction({ contentId: null }));
          setShowContentList(false);
        }
      }
      // Remove layer in NavContent mode when coming from the data page
      if (routeMatches.navPath) {
        setShowContentList(true);
        // This will only be triggered when the user is navigating back from /data page
        if (previousPathnameRef.current?.endsWith("/data")) {
          dispatch(setShowLayer(false));
          dispatch(toggleEmbedElements({ legend: false, time_slider: false }));
          dispatch(setSelectedLayerIds({ layerId: null, isPrimary: false }));

          // reset gthe globe view
          dispatch(setFlyTo(config.globe.view));
        }
      }

      if (routeMatches.dataPath) {
        setShowDataSet(true);

        if (!isMobile) {
          // As we use the CSS scale to increase the size of the canvas to make appear the globe bigger
          // If we don't want to re-mount the globe component AND keep the canvas size across the entire screen, what we do here is zoom out to make the globe appear smaller

          const layer = layers?.find((layer) => layer.id === mainId);
          const position = layer?.position;

          dispatch(
            setFlyTo({
              ...(position?.length === 2
                ? { lat: position[1], lng: position[0] }
                : config.globe.view),
              altitude: config.globe.view.altitude * 2,
              isAnimated: true,
            }),
          );
        }
      }
      // Store the current pathname for next comparison
      previousPathnameRef.current = pathname;
    },
    [dispatch, getRouteMatches, layers, mainId, updateAutoRotationState],
  );

  const isMobile = useScreenSize().isMobile;

  // Handle initial state and direct URL changes
  useEffect(() => {
    handlePathnameChange(location.pathname, isMobile);
  }, [location.pathname, handlePathnameChange, isMobile]);

  return { showContentList, showDataSet };
}
