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
import { appRouteSelector } from "../selectors/route-match";
import {  AppRoute } from "../types/app-routes";

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
  const { appRoute } = useSelector(appRouteSelector);
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
    (currentRoute: AppRoute, isMobile: boolean) => {
      // Update auto-rotation state
      updateAutoRotationState(currentRoute === AppRoute.Base);

      switch (currentRoute) {
        case AppRoute.Base:
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

        case AppRoute.NavContent:
          dispatch(setShowLayer(false));
          dispatch(toggleEmbedElements({ legend: false, time_slider: false }));
          dispatch(setSelectedLayerIds({ layerId: null, isPrimary: false }));
          // Reset the globe view
          dispatch(setFlyTo(config.globe.view));
          break;

        case AppRoute.Data:
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
    if (appRoute && appRoute === previousPathnameRef.current) {
      return;
    }
    handlePathnameChange(appRoute, isMobile);
  }, [appRoute, isMobile, handlePathnameChange]);
}
