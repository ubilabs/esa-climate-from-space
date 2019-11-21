import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';
import cx from 'classnames';

import {storyListSelector} from '../../selectors/story/list';
import StoryListItem from '../story-list-item/story-list-item';

import {StoryMode} from '../../types/story-mode';

import styles from './story-list.styl';

interface Props {
  mode: StoryMode;
  onSelectStory?: (id: string) => void;
}

const StoryList: FunctionComponent<Props> = ({
  mode,
  onSelectStory = () => {}
}) => {
  const stories = useSelector(storyListSelector);

  const classes = cx(
    styles.storyList,
    mode === StoryMode.Present && styles.present
  );

  return (
    <div className={classes}>
      {stories.map(story => (
        <StoryListItem
          key={story.id}
          story={story}
          mode={mode}
          onSelectStory={id => onSelectStory(id)}
        />
      ))}
    </div>
  );
};

export default StoryList;
