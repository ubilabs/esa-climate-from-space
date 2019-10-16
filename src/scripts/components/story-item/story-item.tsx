import React, {FunctionComponent} from 'react';

import {Story} from '../../types/story';

import styles from './story-item.styl';

interface Props {
  story: Story;
}

const StoryItem: FunctionComponent<Props> = ({story}) => (
  <div className={styles.storyItem}>
    <div className={styles.image}></div>
    <p className={styles.title}>{story.title}</p>
  </div>
);

export default StoryItem;
