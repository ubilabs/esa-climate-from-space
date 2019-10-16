import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';

import styles from './stories-button.styl';
import {FormattedMessage} from 'react-intl';

const StoriesButton: FunctionComponent<{}> = () => (
  <Link to={'/stories'} className={styles.storiesButton}>
    <FormattedMessage id="stories" />
  </Link>
);

export default StoriesButton;
