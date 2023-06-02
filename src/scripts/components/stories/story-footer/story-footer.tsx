import React, {FunctionComponent} from 'react';
import cx from 'classnames';

import StoryPagination from '../story-pagination/story-pagination';
import Autoplay from '../autoplay/autoplay';
import {useStoryNavigation} from '../../../hooks/use-story-navigation';
import {useMouseMove} from '../../../hooks/use-mouse-move';

import {StoryMode} from '../../../types/story-mode';
import {Story} from '../../../types/story';

import styles from './story-footer.module.styl';

interface Props {
  mode: StoryMode | null;
  slideIndex: number;
  selectedStory: Story | null;
  videoDuration: number;
}

const StoryFooter: FunctionComponent<Props> = ({
  mode,
  slideIndex,
  selectedStory,
  videoDuration
}) => {
  const isShowcaseMode = mode === StoryMode.Showcase;
  const isStoriesMode = mode === StoryMode.Stories;
  const {
    nextSlideLink,
    previousSlideLink,
    autoPlayLink,
    delay
  } = useStoryNavigation(videoDuration);
  const mouseMove = useMouseMove();
  const footerClasses = cx(
    styles.storyFooter,
    !isStoriesMode && !mouseMove && styles.slideOutFooter
  );

  return (
    <div className={footerClasses}>
      {selectedStory && (
        <StoryPagination
          mode={mode}
          slideIndex={slideIndex}
          storySlidesLength={selectedStory.slides.length}
          nextSlideLink={nextSlideLink}
          previousSlideLink={previousSlideLink}
        />
      )}
      {isShowcaseMode && autoPlayLink && delay && (
        <Autoplay delay={delay} autoPlayLink={autoPlayLink} />
      )}
    </div>
  );
};

export default StoryFooter;
