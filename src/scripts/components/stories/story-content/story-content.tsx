import React, {FunctionComponent} from 'react';
import ReactMarkdown from 'react-markdown';
import cx from 'classnames';

import {getStoryMediaUrl, getStoryLinkUrl} from '../../../libs/get-story-urls';
import {useSlide} from '../../../hooks/use-slide';

import {StoryMode} from '../../../types/story-mode';
import {Slide} from '../../../types/story';

import styles from './story-content.styl';

interface Props {
  storyId: string;
  mode: StoryMode;
  slide: Slide;
}

const StoryContent: FunctionComponent<Props> = ({mode, slide, storyId}) => {
  const storyText = mode === StoryMode.Stories ? slide.text : slide.shortText;

  useSlide(slide);

  const contentClasses = cx(
    styles.content,
    mode !== StoryMode.Stories && styles.shortTextContent
  );

  const transformImageUri = (originalSrc: string) =>
    getStoryMediaUrl(storyId, originalSrc);

  const transformLinkUri = (originalSrc: string) =>
    getStoryLinkUrl(storyId, originalSrc);

  return (
    <div className={contentClasses}>
      <ReactMarkdown
        source={storyText}
        transformImageUri={transformImageUri}
        transformLinkUri={transformLinkUri}
        linkTarget="_blank"
        allowedTypes={[
          'heading',
          'text',
          'paragraph',
          'break',
          'strong',
          'emphasis',
          'image',
          'imageReference',
          'list',
          'listItem',
          'link'
        ]}
      />
    </div>
  );
};

export default StoryContent;
