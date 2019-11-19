import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';

import StoryList from '../story-list/story-list';

import {StoryMode} from '../../types/story-mode';

import styles from './stories-selector.styl';

const StoriesSelector: FunctionComponent = () => (
  <div className={styles.storiesSelector}>
    <Link to="/" className={styles.backButton}>
      <FormattedMessage id="goBack" />
    </Link>
    <h1 className={styles.title}>
      <FormattedMessage id="storymode" />
    </h1>
    <StoryList mode={StoryMode.Stories} />
  </div>
);

export default StoriesSelector;
