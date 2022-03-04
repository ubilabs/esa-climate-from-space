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
import {useLayerTimes} from '../../../hooks/use-formatted-time';

import {GlobeProjection} from '../../../types/globe-projection';
import {LayerListItem} from '../../../types/layer-list';

import styles from './globe-navigation.styl';

interface Props {
  mainLayer: LayerListItem | null;
  compareLayer: LayerListItem | null;
}

const GlobeNavigation: FunctionComponent<Props> = ({
  mainLayer,
  compareLayer
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
        id="projection"
        label={label}
        onClick={() => onProjectionHandler()}
      />
      <div
        className={styles.compass}
        id="compass"
        onClick={() => dispatch(setFlyToAction({...defaultView}))}>
        <CompassIcon />
      </div>
      <Button
        className={styles.downloadIcon}
        id="download"
        icon={DownloadIcon}
        onClick={() =>
          downloadScreenshot(
            mainTimeFormat,
            compareTimeFormat,
            mainLayer,
            compareLayer
          )
        }
      />
    </div>
  );
};

export default GlobeNavigation;
