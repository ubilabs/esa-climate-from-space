import React, {FunctionComponent} from 'react';

import {ExpandIcon} from '../../../../main/icons/expand-icon';

import styles from './scroll-hint.module.styl';

const ScrollHint: FunctionComponent = () => (
  <div className={styles.scrollHint}>
    Scroll to discover more
    <ExpandIcon />
  </div>
);

export default ScrollHint;
