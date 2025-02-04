import React, {FunctionComponent} from 'react';

import {GlobeImageLayerData} from '../../../types/globe-image-layer-data';

import styles from './gallery.module.css';

interface Props {
  imageLayer: GlobeImageLayerData | null;
}

const Gallery: FunctionComponent<Props> = ({imageLayer}) => (
  <div className={styles.gallery}>
    <div className={styles.galleryItem}>
      <img className={styles.galleryImage} src={imageLayer?.url} />
    </div>
  </div>
);

export default Gallery;
