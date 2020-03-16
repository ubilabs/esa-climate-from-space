import React, {FunctionComponent, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import cx from 'classnames';

import Globes from '../globes/globes';
import {useStoryParams} from '../../hooks/use-story-params';
import StoryContent from '../story-content/story-content';
import StoryMedia from '../story-media/story-media';
import StoryHeader from '../story-header/story-header';
import StoryFooter from '../story-footer/story-footer';
import fetchStory from '../../actions/fetch-story';

import {StoryMode} from '../../types/story-mode';

import styles from './story.styl';
import {storyListSelector} from '../../selectors/story/list';

const Story: FunctionComponent = () => {
  const storyParams = useStoryParams();
  const dispatch = useDispatch();
  const {mode, slideIndex, currentStoryId, selectedStory} = storyParams;

  const storyClasses = cx(
    styles.story,
    storyParams?.mode === StoryMode.Present && styles.presentStory,
    mode === StoryMode.Showcase && styles.showcaseStory
  );

  // fetch story of active storyId
  useEffect(() => {
    currentStoryId && dispatch(fetchStory(currentStoryId));
  }, [dispatch, currentStoryId]);

  const storyList = useSelector(storyListSelector);
  const currentStory = storyList.find(story => story.id === currentStoryId);

  if (!mode) {
    return null;
  }

  return (
    <div className={storyClasses}>
      {currentStory && (
        <StoryHeader mode={mode} storyTitle={currentStory.title} />
      )}
      <main className={styles.main}>
        {/* Instead of rendering only the currect slide we map over all slides to
        enforce a newly mounted component when the slideNumber changes */}
        {selectedStory?.slides.map(
          (currentSlide, index) =>
            index === slideIndex && (
              <StoryContent mode={mode} slide={currentSlide} key={index} />
            )
        )}
        <Globes />
        {false && <StoryMedia />}
      </main>
      <StoryFooter mode={mode} />
    </div>
  );
};

export default Story;
