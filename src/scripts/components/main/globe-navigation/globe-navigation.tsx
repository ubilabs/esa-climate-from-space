import { RenderMode } from "@ubilabs/esa-webgl-globe";
import { FunctionComponent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "svg-loaders-react";

import config from "../../../config/main";
import { useLayerTimes } from "../../../hooks/use-formatted-time";
import { downloadScreenshot } from "../../../libs/download-screenshot";
import { projectionSelector } from "../../../selectors/globe/projection";
import { timeSelector } from "../../../selectors/globe/time";
import Button from "../button/button";
import { CompassIcon } from "../icons/compass-icon";
import { DownloadIcon } from "../icons/download-icon";
import { LocationIcon } from "../icons/location-icon";

import { setFlyTo } from "../../../reducers/fly-to";
import { setGlobeProjection } from "../../../reducers/globe/projection";
import { State } from "../../../reducers";
import { GlobeProjection } from "../../../types/globe-projection";

import { selectedLayerIdsSelector } from "../../../selectors/layers/selected-ids";
import { layerListItemSelector } from "../../../selectors/layers/list-item";
import { multiGlobeSyncEnabledSelector } from "../../../selectors/globe/multi-globe-sync";
import { toggleMultiGlobeSync } from "../../../reducers/globe/multi-globe-sync";

import styles from "./globe-navigation.module.css";

const GlobeNavigation: FunctionComponent = () => {
  const dispatch = useDispatch();
  const [locationLoading, setLocationLoading] = useState(false);
  const defaultView = config.globe.view;
  const projectionState = useSelector(projectionSelector);
  const label =
    projectionState.projection === GlobeProjection.Sphere ? "2D" : "3D";
  const time = useSelector(timeSelector);
  const { mainTimeFormat, compareTimeFormat } = useLayerTimes(time, null, null);

  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  const { mainId, compareId } = selectedLayerIds;

  const mainLayer = useSelector((state: State) =>
    layerListItemSelector(state, mainId),
  );
  const compareLayer = useSelector((state: State) =>
    layerListItemSelector(state, compareId),
  );

  const multiGlobeSyncEnabled = useSelector(multiGlobeSyncEnabledSelector);
  const isCompareLayerSelected = Boolean(compareLayer);
  const multiGlobeSyncToggleLabelId = multiGlobeSyncEnabled
    ? "multiGlobeSync.disable"
    : "multiGlobeSync.enable";

  const onProjectionHandler = () => {
    const newProjection =
      projectionState.projection === GlobeProjection.Sphere
        ? GlobeProjection.PlateCaree
        : GlobeProjection.Sphere;

    dispatch(
      setGlobeProjection({
        projection: newProjection,
        morphTime: 2,
      }),
    );
  };

  const onLocateMeHandler = () => {
    setLocationLoading(true);

    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newView = {
          renderMode: "globe" as RenderMode.GLOBE,
          lng: position.coords.longitude,
          lat: position.coords.latitude,
          altitude: 0,
          zoom: 0,
        };
        dispatch(setFlyTo(newView));
        setLocationLoading(false);
      },
      (error) => {
        console.error(`Error Code = ${error.code} - ${error.message}`);
      },
    );
  };

  return (
    <div className={styles.globeNavigation}>
      {isCompareLayerSelected && (
        <Button
          className={styles.toggleMultiGlobeSync}
          label={multiGlobeSyncToggleLabelId}
          ariaLabel={multiGlobeSyncToggleLabelId}
          hideLabelOnMobile
          onClick={() => dispatch(toggleMultiGlobeSync())}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
          </svg>
        </Button>
      )}
      <div className={styles.navItems}>
        {locationLoading ? (
          <Oval className={styles.locateMe} />
        ) : (
          <Button
            icon={LocationIcon}
            className={styles.locateMe}
            id="locate-me"
            onClick={onLocateMeHandler}
          />
        )}
        <Button
          className={styles.projection}
          id="ui-projection"
          label={label}
          onClick={onProjectionHandler}
        />
        <div
          className={styles.compass}
          // id is used in data-widget.tsx to identify compass element
          id="ui-compass"
          onClick={() => dispatch(setFlyTo({ ...defaultView }))}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              dispatch(setFlyTo({ ...defaultView }));
            }
          }}
          role="button"
          tabIndex={0}
        >
          <CompassIcon />
        </div>
        <Button
          className={styles.downloadIcon}
          id="ui-download"
          icon={DownloadIcon}
          onClick={() =>
            downloadScreenshot(
              mainTimeFormat,
              compareTimeFormat,
              mainLayer,
              compareLayer,
            )
          }
        />
      </div>
    </div>
  );
};

export default GlobeNavigation;
