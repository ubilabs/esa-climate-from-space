import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';

import StoryList from '../story-list/story-list';

import styles from './presentation-selector.styl';

const PresentationSelector: FunctionComponent = () => {
  return (
    <div className={styles.presentationSelector}>
      <Link to="/" className={styles.backButton}>
        <FormattedMessage id="goBack" />
      </Link>
      <h1 className={styles.title}>
        <FormattedMessage id="presenter-mode" />
      </h1>
      <StoryList />
    </div>
  );
};

export default PresentationSelector;
