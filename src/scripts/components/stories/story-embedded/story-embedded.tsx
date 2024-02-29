import React, {FunctionComponent} from 'react';
import {EmbeddedItem} from '../../../types/gallery-item';

import styles from './story-embedded.module.styl';
import Caption from '../caption/caption';
import {ImageFit} from '../../../types/image-fit';

interface Props {
  embeddedItem: EmbeddedItem;
}

const StoryEmbedded: FunctionComponent<Props> = ({embeddedItem}) => {
  const {description} = embeddedItem;
  return (
    <div className={styles.embeddedContent}>
      <iframe src={embeddedItem.embeddedSrc}></iframe>
      {description && (
        <Caption
          showLightbox={false}
          imageFit={ImageFit.Cover}
          content={description}
        />
      )}
    </div>
  );
};

export default StoryEmbedded;
