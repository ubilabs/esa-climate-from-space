import React, {FunctionComponent} from 'react';
import {Slide as SlideType} from '../../types/story';
import styles from './slide.styl';
import StoryGallery from '../story-gallery/story-gallery';

interface Props {
  slide: SlideType;
}

const Slide: FunctionComponent<Props> = ({slide}) => (
  <div className={styles.slide}>
    {slide.images && slide.images.length && (
      <StoryGallery images={slide.images} />
    )}
    <div className={styles.content}>
      <h1>{slide.title}</h1>
      <p>{slide.bodytext}</p>
    </div>
  </div>
);

export default Slide;
