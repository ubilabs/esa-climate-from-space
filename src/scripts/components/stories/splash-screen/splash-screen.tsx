import React, {FunctionComponent} from 'react';
import ReactMarkdown from 'react-markdown';
import cx from 'classnames';

import {getStoryAssetUrl} from '../../../libs/get-story-asset-urls';

import {Slide} from '../../../types/story';
import {StoryMode} from '../../../types/story-mode';

import styles from './splash-screen.styl';

interface Props {
  storyId: string;
  mode: StoryMode;
  slide: Slide;
}

const SplashScreen: FunctionComponent<Props> = ({storyId, mode, slide}) => {
  const imageUrl = slide.images && getStoryAssetUrl(storyId, slide.images[0]);
  const contentClasses = cx(
    styles.content,
    mode !== StoryMode.Stories && styles.presentationContent
  );

  return (
    <div
      className={styles.splashscreen}
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.0)), url(${imageUrl})`,
        width: '100%',
        height: '100%'
      }}>
      <div className={contentClasses}>
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
