import React, {FunctionComponent} from 'react';

import styles from './presentation-selector.styl';
import Stories from '../stories/stories';

const PresentationSelector: FunctionComponent<{}> = () => (
  <div className={styles.presentationSelector}>
    <h1>Presenter Test</h1>
    <Stories />
  </div>
);

export default PresentationSelector;
