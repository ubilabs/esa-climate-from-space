import React, {FunctionComponent} from 'react';

import StoryPagination from '../story-pagination/story-pagination';
import Autoplay from '../autoplay/autoplay';
import {useStoryNavigation} from '../../hooks/use-story-navigation';

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
  const {nextSlideLink, previousSlideLink, autoPlayLink} = useStoryNavigation();

  return (
    <div className={styles.storyFooter}>
      {selectedStory && (
        <StoryPagination
          mode={mode}
          slideIndex={slideIndex}
          storySlidesLength={selectedStory.slides.length}
          nextSlideLink={nextSlideLink}
          previousSlideLink={previousSlideLink}
        />
      )}
      {isShowcaseMode && autoPlayLink && (
        <Autoplay autoPlayLink={autoPlayLink} />
      )}
    </div>
  );
};

export default StoryFooter;
