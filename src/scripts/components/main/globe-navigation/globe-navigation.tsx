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
import { GlobeSyncIcon } from "../icons/globe-sync-icon";
import { GlobeSyncOffIcon } from "../icons/globe-sync-off-icon";
import { DownloadIcon } from "../icons/download-icon";
import { LocationIcon } from "../icons/location-icon";

import { setFlyTo } from "../../../reducers/fly-to";
import { setGlobeProjection } from "../../../reducers/globe/projection";
import { State } from "../../../reducers";
import { GlobeProjection } from "../../../types/globe-projection";

import { selectedLayerIdsSelector } from "../../../selectors/layers/selected-ids";
import { layerListItemSelector } from "../../../selectors/layers/list-item";
import { toggleMultiGlobeSync } from "../../../reducers/globe/multi-globe-sync";
import { multiGlobeSyncEnabledSelector } from "../../../selectors/globe/multi-globe-sync";

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

  const isCompareLayerSelected = Boolean(compareLayer);
  const multiGlobeSyncEnabled = useSelector(multiGlobeSyncEnabledSelector);

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
          icon={multiGlobeSyncEnabled ? GlobeSyncIcon : GlobeSyncOffIcon}
          label="multiGlobeSync.label"
          ariaLabel="multiGlobeSync.label"
          hideLabelOnMobile
          onClick={() => dispatch(toggleMultiGlobeSync())}
        />
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
