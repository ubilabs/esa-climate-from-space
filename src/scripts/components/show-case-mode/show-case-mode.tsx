import React, {FunctionComponent} from 'react';

import styles from './show-case-mode.styl';
import Stories from '../stories/stories';

const ShowCaseMode: FunctionComponent<{}> = () => (
  <div className={styles.showCaseContainer}>
    <h1>Show Case Test</h1>
    <Stories />
  </div>
);

export default ShowCaseMode;
