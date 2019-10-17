import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';

import StoryList from '../story-list/story-list';

import styles from './showcase-selector.styl';

const ShowcaseSelector: FunctionComponent = () => (
  <div className={styles.showcaseSelector}>
    <Link to="/" className={styles.backButton}>
      Go back
    </Link>
    <h1 className={styles.title}>Showcase Mode</h1>
    <StoryList />
  </div>
);

export default ShowcaseSelector;
