import React, {FunctionComponent} from 'react';

import styles from './snap-wrapper.module.styl';

interface Props {
  children?: React.ReactElement | React.ReactElement[];
}

const SnapWrapper: FunctionComponent<Props> = ({children}) => (
  <div className={styles.snapWrapper}> {children}</div>
);

export default SnapWrapper;
