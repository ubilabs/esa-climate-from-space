import React, {FunctionComponent} from 'react';

import cx from 'classnames';
import Globes from '../globes/globes';
import {useStoryParams} from '../../hooks/use-story-params';
import StoryContent from '../story-content/story-content';
import StoryMedia from '../story-media/story-media';

import {StoryMode} from '../../types/story-mode';

import styles from './story.styl';

const Story: FunctionComponent = () => {
  const storyParams = useStoryParams();

  if (storyParams === null) {
    return null;
  }

  const {mode} = storyParams;

  const storyClasses = cx(
    styles.story,
    storyParams?.mode === StoryMode.Present && styles.presentStory,
    mode === StoryMode.Showcase && styles.showcaseStory
  );

  return (
    <div className={storyClasses}>
      {/* <StoryHeader /> */}
      <StoryContent />
      <Globes />
      <StoryMedia />
      {/* <StoryFooter /> */}
    </div>
  );
};

export default Story;
