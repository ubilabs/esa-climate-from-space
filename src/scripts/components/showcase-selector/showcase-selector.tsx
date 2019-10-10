import React, {FunctionComponent} from 'react';

import styles from './showcase-selector.styl';
import Stories from '../stories/stories';

const ShowcaseSelector: FunctionComponent<{}> = () => (
  <div className={styles.showcaseSelector}>
    <h1>Showcase Test</h1>
    <Stories />
  </div>
);

export default ShowcaseSelector;
