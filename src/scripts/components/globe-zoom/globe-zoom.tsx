import React, {FunctionComponent} from 'react';

import Button from '../button/button';
import {ZoomIn} from '../icons/zoom-in';
import {ZoomOut} from '../icons/zoom-out';

import styles from './globe-zoom.styl';

const GlobeZoom: FunctionComponent = () => {
  return (
    <div className={styles.globeZoom}>
      <Button icon={ZoomIn} onClick={() => console.log('placeholder')} />
      <Button icon={ZoomOut} onClick={() => console.log('placeholder')} />
    </div>
  );
};

export default GlobeZoom;
