import React, {FunctionComponent} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import config from '../../../config/main';
import Button from '../button/button';
import {CompassIcon} from '../icons/compass-icon';
import {DownloadIcon} from '../icons/download-icon';
import setGlobeProjectionAction from '../../../actions/set-globe-projection';
import {projectionSelector} from '../../../selectors/globe/projection';
import setFlyToAction from '../../../actions/set-fly-to';
import {downloadScreenshot} from '../../../libs/download-screenshot';

import {GlobeProjection} from '../../../types/globe-projection';

import styles from './globe-navigation.styl';
import {useLayerTimes} from '../../../hooks/use-formatted-time';

interface Props {
  mainLayerName?: string;
  compareLayerName?: string;
}

const GlobeNavigation: FunctionComponent<Props> = ({
  mainLayerName,
  compareLayerName
}) => {
  const dispatch = useDispatch();
  const defaultView = config.globe.view;
  const projectionState = useSelector(projectionSelector);
  const label =
    projectionState.projection === GlobeProjection.Sphere ? '2D' : '3D';
  const {mainTimeFormat, compareTimeFormat} = useLayerTimes();

  const onProjectionHandler = () => {
    const newProjection =
      projectionState.projection === GlobeProjection.Sphere
        ? GlobeProjection.PlateCaree
        : GlobeProjection.Sphere;

    dispatch(setGlobeProjectionAction(newProjection, 2));
  };

  return (
    <div className={styles.globeNavigation}>
      <Button
        className={styles.projection}
        label={label}
        onClick={() => onProjectionHandler()}
      />
      <div
        className={styles.compass}
        onClick={() => dispatch(setFlyToAction({...defaultView}))}>
        <CompassIcon />
      </div>
      <Button
        className={styles.downloadIcon}
        icon={DownloadIcon}
        onClick={() =>
          downloadScreenshot(
            mainTimeFormat,
            compareTimeFormat,
            mainLayerName,
            compareLayerName
          )
        }
      />
    </div>
  );
};

export default GlobeNavigation;
