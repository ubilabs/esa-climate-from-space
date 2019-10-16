import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';

import styles from './stories-button.styl';

const StoriesButton: FunctionComponent<{}> = () => (
  <Link to={'/stories'} className={styles.storiesButton}>
    Stories
  </Link>
);

export default StoriesButton;
