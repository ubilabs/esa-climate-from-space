import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';

import StoryList from '../story-list/story-list';

import styles from './showcase-selector.styl';

const ShowcaseSelector: FunctionComponent = () => (
  <div className={styles.showcaseSelector}>
    <Link to="/" className={styles.backButton}>
      <FormattedMessage id="goBack" />
    </Link>
    <h1 className={styles.title}>
      <FormattedMessage id="showcase-mode" />
    </h1>
    <StoryList />
  </div>
);

export default ShowcaseSelector;
