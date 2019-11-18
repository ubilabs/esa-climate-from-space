import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';

import StoryList from '../story-list/story-list';

import {StoryMode} from '../../types/story-mode';

import styles from './showcase-selector.styl';

const ShowcaseSelector: FunctionComponent = () => (
  <div className={styles.showcaseSelector}>
    <Link to="/" className={styles.backButton}>
      <FormattedMessage id="goBack" />
    </Link>
    <h1 className={styles.title}>
      <FormattedMessage id="showcase-mode" />
    </h1>
    <StoryList mode={StoryMode.Showcase} />
  </div>
);

export default ShowcaseSelector;
