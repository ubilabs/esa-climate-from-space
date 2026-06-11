import { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { WebGlGlobe } from "@ubilabs/esa-webgl-globe";

import config from "../config/main";

import { AppRoute } from "../types/app-routes";
import { GlobeProjection } from "../types/globe-projection";

import { setSelectedContentAction } from "../reducers/content";
import { setFlyTo } from "../reducers/fly-to";
import { setSelectedLayerIds } from "../reducers/layers";
import { setShowLayer } from "../reducers/show-layer-selector";
import { setGlobeSpinning } from "../reducers/globe/spinning";
import { setGlobeProjection } from "../reducers/globe/projection";

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
  const location = useLocation();
  const dispatch = useDispatch();
  const appRoute = useSelector(appRouteSelector);
  const previousPathnameRef = useRef<string | null>(null);

  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  const { mainId } = selectedLayerIds;
  const language = useSelector(languageSelector);
  const { data: layers } = useGetLayerListQuery(language);

  const redirectLegacyLayerUrl = useCallback(() => {
    const layerId = mainId;
    if (layerId && !layers?.length) {
      return true;
    }

    const layer = layers?.find((layer) => layer.id === layerId);
    if (layer && layer.categories?.length) {
      dispatch(setSelectedLayerIds({ layerId, isPrimary: true }));
      navigate(
        {
          pathname: `/${layer.categories[0]}/data`,
          search: location.search,
        },
        { replace: true },
      );
      return true;
    }

    return false;
  }, [dispatch, layers, location.search, mainId, navigate]);

  const updateAutoRotationState = useCallback(
    (shouldAutoSpin: boolean) => {
      dispatch(setGlobeSpinning(shouldAutoSpin));
    },
    [dispatch],
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

    if (
      previousPathnameRef.current === AppRoute.Data &&
      appRoute !== AppRoute.Data
    ) {
      dispatch(
        setGlobeProjection({
          projection: GlobeProjection.Sphere,
          morphTime: 2,
        }),
      );
    }

    switch (appRoute) {
      case AppRoute.Base:
        // On initial load, attempt to select the data layer specified via URL parameters.
        // This ensures backward compatibility with CfS versions prior to 2.0.
        if (!previousPathnameRef.current) {
          if (redirectLegacyLayerUrl()) {
            return;
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

        // reset all layers on base route
        dispatch(setSelectedLayerIds({ layerId: null, isPrimary: true }));
        dispatch(setSelectedLayerIds({ layerId: null, isPrimary: false }));
        dispatch(setSelectedContentAction({ contentId: null }));
        break;

      case AppRoute.NavContent:
        if (
          !previousPathnameRef.current &&
          // Some legacy embed links use /index.html as the hash route. React Router
          // matches that as a content category, so handle it like the root route here.
          location.pathname === "/index.html" &&
          redirectLegacyLayerUrl()
        ) {
          return;
        }

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
  }, [
    appRoute,
    dispatch,
    layers,
    location.search,
    location.pathname,
    mainId,
    navigate,
    redirectLegacyLayerUrl,
    selectedLayerIds?.mainId,
  ]);

  // Update globe states based on route changes
  useEffect(() => {
    if (!globe) {
      return;
    }

    updateAutoRotationState(appRoute === AppRoute.Base);

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
