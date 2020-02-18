import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';

import StoryList from '../story-list/story-list';

import {StoryMode} from '../../types/story-mode';

import styles from './presentation-selector.styl';

const PresentationSelector: FunctionComponent = () => (
  <div className={styles.presentationSelector}>
    <div className={styles.header}>
      <Link to="/" className={styles.backButton}>
        <FormattedMessage id="goBack" />
      </Link>
      <h1 className={styles.title}>
        <FormattedMessage id="presenterMode" />
      </h1>
    </div>
    <StoryList mode={StoryMode.Present} />
  </div>
);

export default PresentationSelector;
