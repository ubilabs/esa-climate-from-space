import React, {FunctionComponent} from 'react';

import StoryPagination from '../story-pagination/story-pagination';
import Autoplay from '../autoplay/autoplay';

import {StoryMode} from '../../types/story-mode';
import {Story} from '../../types/story';

import styles from './story-footer.styl';

interface Props {
  mode: StoryMode | null;
  slideIndex: number;
  selectedStory: Story | null;
}

const StoryFooter: FunctionComponent<Props> = ({
  mode,
  slideIndex,
  selectedStory
}) => {
  const isShowcaseMode = mode === StoryMode.Showcase;
  return (
    <div className={styles.storyFooter}>
      <StoryPagination
        mode={mode}
        slideIndex={slideIndex}
        selectedStory={selectedStory}
      />
      {isShowcaseMode && <Autoplay />}
    </div>
  );
};

export default StoryFooter;
