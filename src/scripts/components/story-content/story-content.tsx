import React, {FunctionComponent} from 'react';
import ReactMarkdown from 'react-markdown';
import cx from 'classnames';

import {StoryMode} from '../../types/story-mode';
import {Slide} from '../../types/story';

import styles from './story-content.styl';

interface Props {
  mode: StoryMode;
  slide: Slide;
}

const StoryContent: FunctionComponent<Props> = ({mode, slide}) => {
  const source = mode === StoryMode.Stories ? slide.text : slide.shortText;

  const contentClasses = cx(
    styles.content,
    mode !== StoryMode.Stories && styles.shortTextContent
  );

  return (
    <div className={contentClasses}>
      <ReactMarkdown
        source={source}
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
