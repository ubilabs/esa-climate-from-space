import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';

import styles from './presentation-selector.styl';
import StoryList from '../story-list/story-list';

const PresentationSelector: FunctionComponent<{}> = () => (
  <div className={styles.presentationSelector}>
    <Link to="/">Go back</Link>
    <h1>Presenter Mode</h1>
    <StoryList />
  </div>
);

export default PresentationSelector;
