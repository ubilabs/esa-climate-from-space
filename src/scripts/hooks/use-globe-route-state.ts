import { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { WebGlGlobe } from "@ubilabs/esa-webgl-globe";

import config from "../config/main";

import { AppRoute } from "../types/app-routes";

import { setSelectedContentAction } from "../reducers/content";
import { setFlyTo } from "../reducers/fly-to";
import { setSelectedLayerIds } from "../reducers/layers";
import { setShowLayer } from "../reducers/show-layer-selector";

import { languageSelector } from "../selectors/language";
import { selectedLayerIdsSelector } from "../selectors/layers/selected-ids";
import { appRouteSelector } from "../selectors/route-match";

import { useGetLayerListQuery } from "../services/api";

/**
 * Hook that manages globe state based on location changes
 * Handles auto-rotation functionality based on current route
 * Please import this hook only once in the globe.tsx as it would fire state dispachtes multiple times
 * We should refactor this hook into dedicated components in the future
 */
export function useGlobeRouteState(globe: WebGlGlobe | null) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const appRoute = useSelector(appRouteSelector);
  const previousPathnameRef = useRef<string | null>(null);

  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  const { mainId } = selectedLayerIds;
  const language = useSelector(languageSelector);
  const { data: layers } = useGetLayerListQuery(language);

  const updateAutoRotationState = useCallback(
    (shouldAutoSpin: boolean, globe: WebGlGlobe) => {
      if (shouldAutoSpin) {
        globe.startAutoSpin();
      } else {
        globe.stopAutoSpin();
      }
    },
    [],
  );

  const updateUserInteractionEnabledState = useCallback(
    (shouldUserInteract: boolean, globe: WebGlGlobe) => {
      globe.setControlsInteractionEnabled(shouldUserInteract);
    },
    [],
  );
  // Handle  direct URL changes
  useEffect(() => {
    // only call function when the route match *changes*
    if (appRoute && appRoute === previousPathnameRef.current) {
      return;
    }

    switch (appRoute) {
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

        dispatch(
          setFlyTo({
            ...config.globe.view,
            isAnimated: true,
            interpolationFactor: 0.08,
          }),
        );

        dispatch(setSelectedLayerIds({ layerId: null, isPrimary: true }));
        dispatch(setSelectedContentAction({ contentId: null }));
        break;

      case AppRoute.NavContent:
        dispatch(setShowLayer(false));
        dispatch(setSelectedLayerIds({ layerId: null, isPrimary: false }));
        break;

      case AppRoute.Data:
        // Handle data route
        {
          const layer = layers?.find((layer) => layer.id === mainId);
          const position = layer?.position;

          dispatch(
            setFlyTo({
              interpolationFactor: 0.1,
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
    previousPathnameRef.current = appRoute;
  }, [appRoute, dispatch, layers, mainId, navigate, selectedLayerIds?.mainId]);

  // Update globe states based on route changes
  useEffect(() => {
    if (!globe) {
      return;
    }

    updateAutoRotationState(appRoute === AppRoute.Base, globe);
    updateUserInteractionEnabledState(
      appRoute === AppRoute.Stories || appRoute === AppRoute.Data,
      globe,
    );
  }, [
    appRoute,
    globe,
    updateAutoRotationState,
    updateUserInteractionEnabledState,
  ]);
}
