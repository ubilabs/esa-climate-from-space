import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';
import {useLocation} from 'react-router';
import cx from 'classnames';

import {storyListSelector} from '../../selectors/story/list';
import StoryListItem from '../story-list-item/story-list-item';

import styles from './story-list.styl';

const StoryList: FunctionComponent = () => {
  const stories = useSelector(storyListSelector);
  const {pathname} = useLocation();

  const classes = cx(
    styles.storyList,
    pathname === '/present' && styles.present
  );

  return (
    <div className={classes}>
      {stories.map(story => (
        <StoryListItem key={story.id} story={story} pathname={pathname} />
      ))}
    </div>
  );
};

export default StoryList;
