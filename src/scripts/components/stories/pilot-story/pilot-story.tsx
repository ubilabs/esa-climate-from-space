import React, {FunctionComponent, useState} from 'react';
import {Parallax, ParallaxProvider} from 'react-scroll-parallax';

import Share from '../../main/share/share';
import Header from './components/header/header';
import Intro from './components/intro/intro';

import styles from './pilot-story.module.styl';

const PilotStory: FunctionComponent = () => {
  const [storyStarted, setStoryStarted] = useState(false);

  return (
    <div className={styles.pilotStory}>
      <Header>
        <Share />
      </Header>

      <ParallaxProvider>
        <div>
          <Intro
            storyStarted={storyStarted}
            onStoryStart={() => setStoryStarted(true)}
          />
          {/* to be replaced */}
          {storyStarted && (
            <section
              className={styles.sectionContainer}
              style={{
                height: '100vh',
                backgroundColor: '#dcdcdc',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <Parallax rotate={[0, 720]}>
                <h1>Space for more</h1>
              </Parallax>
            </section>
          )}
        </div>
      </ParallaxProvider>
    </div>
  );
};

export default PilotStory;
