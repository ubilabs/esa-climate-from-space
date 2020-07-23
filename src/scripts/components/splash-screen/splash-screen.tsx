import React, {FunctionComponent} from 'react';

import ReactMarkdown from 'react-markdown';

import {Slide} from '../../types/story';

import styles from './splash-screen.styl';
import {getStoryMediaUrl} from '../../libs/get-story-media-url';

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
        background: `center / cover no-repeat url(${imageUrl})
`
      }}>
      <div className={styles.title}>
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
