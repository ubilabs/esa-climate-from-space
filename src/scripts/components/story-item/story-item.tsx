import React, {FunctionComponent} from 'react';

import {Story} from '../../types/story';
import {Link} from 'react-router-dom';

import styles from './story-item.styl';

interface Props {
  story: Story;
}
const StoryItem: FunctionComponent<Props> = ({story}) => (
  <Link to={`/stories/${story.id}`}>
    <div className={styles.storyItem}>
      <img src={story.image} className={styles.image} />
      <p className={styles.title}>{story.title}</p>
      <p className={styles.description}>{story.description}</p>
    </div>
  </Link>
);

export default StoryItem;
