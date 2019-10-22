import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';

import {StoryListItem as StoryListItemType} from '../../types/story-list';

import styles from './story-list-item.styl';

interface Props {
  story: StoryListItemType;
}
const StoryListItem: FunctionComponent<Props> = ({story}) => (
  <Link to={`/stories/${story.id}`}>
    <div className={styles.storyItem}>
      <img src={story.image} className={styles.image} />
      <p className={styles.title}>{story.title}</p>
      <p className={styles.description}>{story.description}</p>
    </div>
  </Link>
);

export default StoryListItem;
