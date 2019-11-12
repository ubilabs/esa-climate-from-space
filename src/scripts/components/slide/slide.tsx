import React, {FunctionComponent} from 'react';
import ReactMarkdown from 'react-markdown';

import StoryGallery from '../story-gallery/story-gallery';
import StoryVideo from '../story-video/story-video';

import {Slide as SlideType} from '../../types/story';

import styles from './slide.styl';

interface Props {
  slide: SlideType;
}

const Slide: FunctionComponent<Props> = ({slide}) => (
  <div className={styles.slide}>
    {(slide.images && (
      <StoryGallery
        images={slide.images}
        fullscreenGallery={slide.fullscreenGallery}
      />
    )) ||
      (slide.videoId && <StoryVideo videoId={slide.videoId} />)}
    <div className={styles.content}>
      <h1 className={styles.title}>{slide.title}</h1>
      <ReactMarkdown source={slide.bodytext} />
    </div>
  </div>
);

export default Slide;
