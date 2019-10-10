import React, {FunctionComponent} from 'react';

import styles from './presenter-mode.styl';
import Stories from '../stories/stories';

const PresenterMode: FunctionComponent<{}> = () => (
  <div className={styles.presenterContainer}>
    <h1>Presenter Test</h1>
    <Stories />
  </div>
);

export default PresenterMode;
