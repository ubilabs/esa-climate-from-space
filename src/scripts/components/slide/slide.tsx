import React, {FunctionComponent} from 'react';
import ReactMarkdown from 'react-markdown';

import StoryGallery from '../story-gallery/story-gallery';
import StoryVideo from '../story-video/story-video';
import cx from 'classnames';

import {Slide as SlideType} from '../../types/story';
import {StoryMode} from '../../types/story-mode';

import styles from './slide.styl';

interface Props {
  mode: StoryMode;
  slide: SlideType;
}

const Slide: FunctionComponent<Props> = ({mode, slide}) => {
  const slideClasses = cx(
    styles.slide,
    mode === StoryMode.Present && styles.presentSlide
  );
  return (
    <div className={slideClasses}>
      {(slide.images && (
        <StoryGallery
          images={slide.images}
          fullscreenGallery={slide.fullscreenGallery}
        />
      )) ||
        (slide.videoId && <StoryVideo videoId={slide.videoId} />)}
      <div className={styles.content}>
        <ReactMarkdown
          source={slide.bodytext}
          allowedTypes={[
            'heading',
            'text',
            'paragraph',
            'break',
            'strong',
            'emphasis',
            'list',
            'listItem'
          ]}
        />
      </div>
    </div>
  );
};

export default Slide;
