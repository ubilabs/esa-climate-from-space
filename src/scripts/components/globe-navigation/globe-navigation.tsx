import React, {FunctionComponent} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import config from '../../config/main';
import Button from '../button/button';
import {CompassIcon} from '../icons/compass-icon';
import {DownloadIcon} from '../icons/download-icon';
import setGlobeProjectionAction from '../../actions/set-globe-projection';
import {projectionSelector} from '../../selectors/globe/projection';
import setFlyToAction from '../../actions/set-fly-to';

import {GlobeProjection} from '../../types/globe-projection';

import styles from './globe-navigation.styl';

const GlobeNavigation: FunctionComponent = () => {
  const dispatch = useDispatch();
  const defaultView = config.globe.view;
  const projectionState = useSelector(projectionSelector);
  const label =
    projectionState.projection === GlobeProjection.Sphere ? '2D' : '3D';

  const onProjectionHandler = () => {
    const newProjection =
      projectionState.projection === GlobeProjection.Sphere
        ? GlobeProjection.PlateCaree
        : GlobeProjection.Sphere;

    dispatch(setGlobeProjectionAction(newProjection, 2));
  };

  return (
    <div className={styles.globeNavigation}>
      <Button label={label} onClick={() => onProjectionHandler()} />
      <Button
        className={styles.compassIcon}
        icon={CompassIcon}
        onClick={() => dispatch(setFlyToAction({...defaultView}))}
      />
      <Button
        className={styles.downloadIcon}
        icon={DownloadIcon}
        onClick={() => console.log('placeholder')}
      />
    </div>
  );
};

export default GlobeNavigation;
