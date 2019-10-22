import React, {FunctionComponent} from 'react';

import styles from './story.styl';

const Story: FunctionComponent = () => (
  <div className={styles.story}>
    <div className={styles.sidepanel}>
      <div className={styles.previewImage}></div>
      <div className={styles.content}>
        <h1>Test</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor optio
          nisi nobis quas ut. Exercitationem, sapiente. Praesentium quidem
          mollitia explicabo voluptatem aperiam deleniti ut sunt atque eaque,
          voluptate commodi in.
        </p>
      </div>
    </div>
  </div>
);

export default Story;
