import React, {FunctionComponent} from 'react';
import ReactMarkdown from 'react-markdown';
import cx from 'classnames';

import {StoryMode} from '../../types/story-mode';
import {Slide} from '../../types/story';
import {getStoryMediaUrl} from '../../libs/get-story-media-url';

import styles from './story-content.styl';
import {useSlide} from '../../hooks/use-slide';

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

  return (
    <div className={contentClasses}>
      <ReactMarkdown
        source={storyText}
        transformImageUri={transformImageUri}
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
          'listItem'
        ]}
      />
    </div>
  );
};

export default StoryContent;
