import React, {FunctionComponent} from 'react';

import {ExpandIcon} from '../../../../main/icons/expand-icon';
import {ScrollIcon} from '../icons/scroll-icon/scroll-icon';

import styles from './scroll-hint.module.styl';
import {useScreenSize} from '../../../../../hooks/use-screen-size';

const ScrollHint: FunctionComponent = () => {
  const {isDesktop} = useScreenSize();
  return (
    <div className={styles.scrollHint}>
      {isDesktop ? <ScrollIcon /> : <ExpandIcon className={styles.animated} />}
      Scroll to discover more
    </div>
  );
};

export default ScrollHint;
