import React, {FunctionComponent} from 'react';

import Button from '../button/button';
import {CompassIcon} from '../icons/compass-icon';
import {DownloadIcon} from '../icons/download-icon';
import {GlobeProjection} from '../../types/globe-projection';
import setGlobeProjectionAction from '../../actions/set-globe-projection';
import {projectionSelector} from '../../selectors/globe/projection';

import styles from './globe-navigation.styl';
import {useDispatch, useSelector} from 'react-redux';

const GlobeNavigation: FunctionComponent = () => {
  const dispatch = useDispatch();
  const projectionState = useSelector(projectionSelector);
  const label =
    projectionState.projection === GlobeProjection.Sphere ? '2D' : '3D';

  const onButtonClickHandler = () => {
    const newProjection =
      projectionState.projection === GlobeProjection.Sphere
        ? GlobeProjection.PlateCaree
        : GlobeProjection.Sphere;

    dispatch(setGlobeProjectionAction(newProjection, 2));
  };

  return (
    <div className={styles.globeNavigation}>
      <Button label={label} onClick={() => onButtonClickHandler()} />
      <Button
        className={styles.compassIcon}
        icon={CompassIcon}
        onClick={() => console.log('placeholder')}
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
