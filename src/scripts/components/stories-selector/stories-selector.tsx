import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';

import StoryList from '../story-list/story-list';

import styles from './stories-selector.styl';

const StoriesSelector: FunctionComponent<{}> = () => (
  <div className={styles.storiesSelector}>
    <Link to="/" className={styles.backButton}>
      Go back
    </Link>
    <h1 className={styles.title}>Story Mode</h1>
    <StoryList />
  </div>
);

export default StoriesSelector;
