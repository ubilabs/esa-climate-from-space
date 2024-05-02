import React, {FunctionComponent, useState} from 'react';
import {Parallax, ParallaxProvider} from 'react-scroll-parallax';

import Share from '../../main/share/share';
import Header from './components/header/header';
import Intro from './components/intro/intro';
import Globe from './components/globe/globe';

import styles from './pilot-story.module.styl';

const PilotStory: FunctionComponent = () => {
  const [storyStarted, setStoryStarted] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <div className={styles.pilotStory}>
      <Header>
        <Share />
      </Header>

      <ParallaxProvider>
        <Globe progress={progress} isSpinning={true} />
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
              <Parallax
                onProgressChange={progress =>
                  // convert progress to percentage
                  setProgress(Math.round(progress * 100 * 2))
                }
                rotate={[0, 720]}>
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
