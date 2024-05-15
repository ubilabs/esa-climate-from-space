import React, {FunctionComponent} from 'react';

import styles from './snap-wrapper.module.styl';

interface Props {
  snapPosition?: string;
  children?: React.ReactElement | React.ReactElement[];
}

const SnapWrapper: FunctionComponent<Props> = ({snapPosition, children}) => (
  <div className={styles.snapWrapper} style={{scrollSnapAlign: snapPosition}}>
    {children}
  </div>
);

export default SnapWrapper;
