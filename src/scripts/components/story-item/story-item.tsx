import React, {FunctionComponent} from 'react';

import styles from './story-item.styl';
import {Story} from '../../actions/fetch-stories';

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
