import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';

import {StoryIcon} from '../icons/story-icon';

import styles from './stories-button.styl';

const StoriesButton: FunctionComponent = () => (
  <Link to={'/stories'} className={styles.storiesButton}>
    <button className={styles.storiesLabel}>
      <StoryIcon />
      <FormattedMessage id="stories" />
    </button>
  </Link>
);

export default StoriesButton;
