import React, {FunctionComponent} from 'react';

import StoryPagination from '../story-pagination/story-pagination';
import Autoplay from '../autoplay/autoplay';
import {useStoryNavigation} from '../../hooks/use-story-navigation';
import cx from 'classnames';

import {StoryMode} from '../../types/story-mode';
import {Story} from '../../types/story';

import styles from './story-footer.styl';
import {useMouseMove} from '../../hooks/use-mouse-move';

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
  const isStoriesMode = mode === StoryMode.Stories;
  const {nextSlideLink, previousSlideLink, autoPlayLink} = useStoryNavigation();
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
      {isShowcaseMode && autoPlayLink && (
        <Autoplay autoPlayLink={autoPlayLink} />
      )}
    </div>
  );
};

export default StoryFooter;
