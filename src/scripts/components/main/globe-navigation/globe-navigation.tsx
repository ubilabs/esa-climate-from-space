import { RenderMode } from "@ubilabs/esa-webgl-globe";
import { FunctionComponent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "svg-loaders-react";

import config from "../../../config/main";
import { useLayerTimes } from "../../../hooks/use-formatted-time";
import { downloadScreenshot } from "../../../libs/download-screenshot";
import { projectionSelector } from "../../../selectors/globe/projection";
import Button from "../button/button";
import { CompassIcon } from "../icons/compass-icon";
import { DownloadIcon } from "../icons/download-icon";
import { LocationIcon } from "../icons/location-icon";

import { setFlyTo } from "../../../reducers/fly-to";
import { setGlobeProjection } from "../../../reducers/globe/projection";
import { GlobeProjection } from "../../../types/globe-projection";
import { LayerListItem } from "../../../types/layer-list";

import styles from "./globe-navigation.module.css";
interface Props {
  mainLayer: LayerListItem | null;
  compareLayer: LayerListItem | null;
}

const GlobeNavigation: FunctionComponent<Props> = ({
  mainLayer,
  compareLayer,
}) => {
  const dispatch = useDispatch();
  const [locationLoading, setLocationLoading] = useState(false);
  const defaultView = config.globe.view;
  const projectionState = useSelector(projectionSelector);
  const label =
    projectionState.projection === GlobeProjection.Sphere ? "2D" : "3D";
  const { mainTimeFormat, compareTimeFormat } = useLayerTimes();

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
        id="ui-compass"
        onClick={() => dispatch(setFlyTo({ ...defaultView }))}
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
  );
};

export default GlobeNavigation;
