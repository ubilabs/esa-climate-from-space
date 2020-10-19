import React, {FunctionComponent} from 'react';
import ReactMarkdown from 'react-markdown';
import cx from 'classnames';

import {getStoryAssetUrl} from '../../../libs/get-story-asset-urls';

import {Slide} from '../../../types/story';

import styles from './splash-screen.styl';
import {StoryMode} from '../../../types/story-mode';

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
        background: `center / cover no-repeat url(${imageUrl}) rgba(0, 0, 0, 0.3)`,
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
