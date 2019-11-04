import React, {FunctionComponent} from 'react';

import StoryGallery from '../story-gallery/story-gallery';

import {Slide as SlideType} from '../../types/story';

import styles from './slide.styl';
import StoryVideo from '../story-video/story-video';

interface Props {
  slide: SlideType;
}

const Slide: FunctionComponent<Props> = ({slide}) => {
  return (
    <div className={styles.slide}>
      {(slide.images && <StoryGallery images={slide.images} />) ||
        (slide.videoId && <StoryVideo videoId={slide.videoId} />)}
      <div className={styles.content}>
        <h1 className={styles.title}>{slide.title}</h1>
        <p className={styles.bodytext}>{slide.bodytext}</p>
      </div>
    </div>
  );
};

export default Slide;
