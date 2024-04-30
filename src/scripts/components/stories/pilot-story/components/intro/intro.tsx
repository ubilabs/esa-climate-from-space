import React, {FunctionComponent} from 'react';
import {ParallaxLayer} from '@react-spring/parallax';

import Button from '../../../../main/button/button';
import styles from './intro.module.styl';

const Intro: FunctionComponent = () => (
  <ParallaxLayer offset={0} speed={1} className={styles.intro}>
    <div className={styles.linkContainer}>
      <Button link="/stories" label="Back"></Button>
    </div>
  </ParallaxLayer>
);

export default Intro;
