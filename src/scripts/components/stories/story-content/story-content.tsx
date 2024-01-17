import React, {FunctionComponent} from 'react';
import ReactMarkdown from 'react-markdown';
import cx from 'classnames';

import {getStoryAssetUrl} from '../../../libs/get-story-asset-urls';
import config from '../../../config/main';

import {StoryMode} from '../../../types/story-mode';
import {Slide} from '../../../types/story';

import styles from './story-content.module.styl';

interface Props {
  storyId: string;
  mode: StoryMode;
  slide: Slide;
}

const StoryContent: FunctionComponent<Props> = ({mode, slide, storyId}) => {
  const storyText = mode === StoryMode.Stories ? slide.text : slide.shortText;

  const contentClasses = cx(
    styles.content,
    mode !== StoryMode.Stories && styles.shortTextContent
  );

  const transformImageUri = (originalSrc: string) =>
    getStoryAssetUrl(storyId, originalSrc);

  const transformLinkUri = (originalSrc: string) =>
    getStoryAssetUrl(storyId, originalSrc);

  const getLinkTarget = (originalSrc: string) => {
    if (originalSrc.startsWith('stories')) {
      return '_self';
    }

    return '_blank';
  };

  return (
    <div className={contentClasses}>
      <ReactMarkdown
        children={storyText || ''}
        transformImageUri={transformImageUri}
        transformLinkUri={transformLinkUri}
        linkTarget={getLinkTarget}
        allowedElements={config.markdownAllowedElements}
      />
    </div>
  );
};

export default StoryContent;
