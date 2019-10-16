import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';

import styles from './stories-button.styl';

const StoriesButton: FunctionComponent<{}> = () => (
  <Link to={'/stories'} className={styles.storiesButton}>
    <FormattedMessage id="stories" />
  </Link>
);

export default StoriesButton;
