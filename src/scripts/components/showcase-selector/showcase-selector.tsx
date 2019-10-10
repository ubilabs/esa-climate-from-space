import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';

import styles from './showcase-selector.styl';
import StoryList from '../story-list/story-list';

const ShowcaseSelector: FunctionComponent<{}> = () => (
  <div className={styles.showcaseSelector}>
    <Link to="/">Go back</Link>
    <h1>Showcase Mode</h1>
    <StoryList />
  </div>
);

export default ShowcaseSelector;
