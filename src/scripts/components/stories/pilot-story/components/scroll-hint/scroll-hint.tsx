import React, {FunctionComponent} from 'react';

import {ExpandIcon} from '../../../../main/icons/expand-icon';
import {ScrollIcon} from '../icons/scroll-icon/scroll-icon';

import styles from './scroll-hint.module.styl';
import {useScreenSize} from '../../../../../hooks/use-screen-size';
import TouchIcon from '../icons/touch-icon/touch-icon';

interface Props {
  isSelectHint?: boolean;
}

const ScrollHint: FunctionComponent<Props> = ({isSelectHint = false}) => {
  const {isDesktop} = useScreenSize();

  const hint = isSelectHint
    ? 'Select a methane giant'
    : 'Scroll to discover more';
  // eslint-disable-next-line no-nested-ternary
  const icon = isSelectHint ? (
    <TouchIcon />
  ) : isDesktop ? (
    <ScrollIcon />
  ) : (
    <ExpandIcon className={styles.animated} />
  );

  return (
    <div className={styles.scrollHint}>
      {icon}
      {hint}
    </div>
  );
};

export default ScrollHint;
