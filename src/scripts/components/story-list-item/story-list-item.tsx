import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import cx from 'classnames';

import {StoryListItem as StoryListItemType} from '../../types/story-list';

import styles from './story-list-item.styl';

interface Props {
  story: StoryListItemType;
  mode: string;
}

const StoryListItem: FunctionComponent<Props> = ({story, mode}) => {
  const classes = cx(styles.storyItem, mode === 'present' && styles.present);

  return (
    <Link to={`/${mode}/${story.id}`}>
      <div className={classes}>
        <img src={story.image} className={styles.image} />
        <p className={styles.title}>{story.title}</p>
        <p className={styles.description}>{story.description}</p>
      </div>
    </Link>
  );
};

export default StoryListItem;
