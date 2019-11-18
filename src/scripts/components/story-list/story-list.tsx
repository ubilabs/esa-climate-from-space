import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';
import cx from 'classnames';

import {storyListSelector} from '../../selectors/story/list';
import StoryListItem from '../story-list-item/story-list-item';

import styles from './story-list.styl';

interface Props {
  mode: string;
}

const StoryList: FunctionComponent<Props> = ({mode}) => {
  const stories = useSelector(storyListSelector);

  const classes = cx(styles.storyList, mode === 'present' && styles.present);

  return (
    <div className={classes}>
      {stories.map(story => (
        <StoryListItem key={story.id} story={story} mode={mode} />
      ))}
    </div>
  );
};

export default StoryList;
