import React, {FunctionComponent, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import cx from 'classnames';

import Globes from '../globes/globes';
import {useStoryParams} from '../../hooks/use-story-params';
import StoryContent from '../story-content/story-content';
import StoryMedia from '../story-media/story-media';
import StoryFooter from '../story-footer/story-footer';
import fetchStory from '../../actions/fetch-story';
import Header from '../header/header';

import {StoryMode} from '../../types/story-mode';

import styles from './story.styl';

const Story: FunctionComponent = () => {
  const storyParams = useStoryParams();
  const dispatch = useDispatch();
  const {
    mode,
    slideIndex,
    currentStoryId,
    selectedStory,
    storyListItem
  } = storyParams;

  const storyClasses = cx(
    styles.story,
    storyParams?.mode === StoryMode.Present && styles.presentStory,
    mode === StoryMode.Showcase && styles.showcaseStory
  );

  // fetch story of active storyId
  useEffect(() => {
    currentStoryId && dispatch(fetchStory(currentStoryId));
  }, [dispatch, currentStoryId]);

  if (!mode) {
    return null;
  }

  return (
    <div className={storyClasses}>
      {storyListItem && (
        <Header
          backLink={`/${mode.toString()}`}
          backButtonId="backToStories"
          title={storyListItem.title}
        />
      )}
      <main className={styles.main}>
        {/* Instead of rendering only the currect slide we map over all slides to
        enforce a newly mounted component when the slideNumber changes */}
        {selectedStory?.slides.map(
          (currentSlide, index) =>
            index === slideIndex && (
              <StoryContent
                storyId={selectedStory.id}
                mode={mode}
                slide={currentSlide}
                key={index}
              />
            )
        )}
        <Globes />
        {false && <StoryMedia />}
      </main>
      <StoryFooter
        mode={mode}
        slideIndex={slideIndex}
        selectedStory={selectedStory}
      />
    </div>
  );
};

export default Story;
