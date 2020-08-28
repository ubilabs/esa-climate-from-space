import React, {FunctionComponent} from 'react';

import styles from './gallery.styl';
import {GlobeImageLayerData} from '../../../types/globe-image-layer-data';

interface Props {
  imageLayer: GlobeImageLayerData | null;
}

const Gallery: FunctionComponent<Props> = ({imageLayer}) => {
  return (
    <div className={styles.gallery}>
      <div className={styles.galleryItem}>
        <img className={styles.galleryImage} src={imageLayer?.url} />
      </div>
    </div>
  );
};

export default Gallery;
