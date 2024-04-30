/* eslint-disable camelcase */
import React, {FunctionComponent, useRef} from 'react';
import {IParallax, Parallax} from '@react-spring/parallax';

import Share from '../../main/share/share';
import Header from './components/header/header';
import Intro from './components/intro/intro';

import styles from './pilot-story.module.styl';

const PilotStory: FunctionComponent = () => {
  const parallax = useRef<IParallax | null>(null);
  return (
    <div className={styles.pilotStory}>
      <Header>
        <Share />
      </Header>

      <Parallax ref={parallax} pages={3}>
        <Intro />
      </Parallax>
    </div>
  );
};

export default PilotStory;
