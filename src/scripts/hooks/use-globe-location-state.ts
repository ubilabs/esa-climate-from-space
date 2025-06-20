import { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import { routeMatchSelector } from "../selectors/route-match";
import { RouteMatch } from "../types/story-mode";

/**
 * Hook that manages globe state based on location changes
 * Handles auto-rotation functionality based on current route
 * Please import this hook only once in the globe.tsx as it would fire state dispachtes multiple times
 * We should refactor this hook into dedicated components in the future
 */
export function useGlobeLocationState() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useScreenSize().isMobile;
  const { routeMatch } = useSelector(routeMatchSelector);
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
   * Process pathname change, log route information, and update state
   */
  const handlePathnameChange = useCallback(
    (currentRoute: RouteMatch, isMobile: boolean) => {
      // Update auto-rotation state
      updateAutoRotationState(currentRoute === RouteMatch.Base);

      switch (currentRoute) {
        case RouteMatch.Base:
          // On initial load, attempt to select the data layer specified via URL parameters.
          // This ensures backward compatibility with CfS versions prior to 2.0.
          if (!previousPathnameRef.current) {
            const layerId = selectedLayerIds?.mainId;
            const layer = layers?.find((layer) => layer.id === layerId);
            if (layer && layer.categories?.length) {
              dispatch(setSelectedLayerIds({ layerId, isPrimary: true }));
              navigate(`/${layer.categories[0]}/data`);
            }
            break;
          }

          dispatch(setSelectedLayerIds({ layerId: null, isPrimary: true }));
          dispatch(setFlyTo(null));
          dispatch(setSelectedContentAction({ contentId: null }));
          break;

        case RouteMatch.NavContent:
          // Remove layer in NavContent mode when coming from the data page
          dispatch(setShowLayer(false));
          dispatch(toggleEmbedElements({ legend: false, time_slider: false }));
          dispatch(setSelectedLayerIds({ layerId: null, isPrimary: false }));
          // Reset the globe view
          dispatch(setFlyTo(config.globe.view));
          break;

        case RouteMatch.Data:
          // Handle data route
          if (!isMobile) {
            const layer = layers?.find((layer) => layer.id === mainId);
            const position = layer?.position;

            dispatch(
              setFlyTo({
                ...config.globe.view,
                ...(position?.length === 2
                  ? { lat: position[1], lng: position[0] }
                  : {}),
                isAnimated: true,
              }),
            );
          }
          break;

        default:
          break;
      }

      // Store the current pathname for next comparison
      previousPathnameRef.current = currentRoute;
    },
    [
      dispatch,
      layers,
      mainId,
      navigate,
      selectedLayerIds?.mainId,
      updateAutoRotationState,
    ],
  );

  // Handle  direct URL changes
  useEffect(() => {
    // only call function when the route match *changes*
    if (routeMatch && routeMatch === previousPathnameRef.current) {
      return;
    }
    handlePathnameChange(routeMatch, isMobile);
  }, [routeMatch, isMobile, handlePathnameChange]);
}
