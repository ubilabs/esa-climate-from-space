import React, {FunctionComponent} from 'react';
import ReactMarkdown from 'react-markdown';

import {getStoryMediaUrl} from '../../libs/get-story-media-url';

import {Slide} from '../../types/story';

import styles from './splash-screen.styl';

interface Props {
  storyId: string;
  slide: Slide;
}

const SplashScreen: FunctionComponent<Props> = ({storyId, slide}) => {
  const imageUrl = slide.images && getStoryMediaUrl(storyId, slide.images[0]);

  return (
    <div
      className={styles.splashscreen}
      style={{
        background: `center / cover no-repeat url(${imageUrl}) rgba(0, 0, 0, 0.3)`,
        width: '100%'
      }}>
      <div className={styles.content}>
        <ReactMarkdown
          source={slide.text}
          allowedTypes={[
            'heading',
            'text',
            'paragraph',
            'break',
            'strong',
            'emphasis'
          ]}
        />
      </div>
    </div>
  );
};

export default SplashScreen;
