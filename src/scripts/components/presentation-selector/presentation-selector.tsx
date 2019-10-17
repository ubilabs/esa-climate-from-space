import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';

import StoryList from '../story-list/story-list';

import styles from './presentation-selector.styl';

const PresentationSelector: FunctionComponent = () => (
  <div className={styles.presentationSelector}>
    <Link to="/" className={styles.backButton}>
      Go back
    </Link>
    <h1 className={styles.title}>Presenter Mode</h1>
    <StoryList />
  </div>
);

export default PresentationSelector;
