import React, {FunctionComponent, useState} from 'react';
import {Parallax, ParallaxProvider} from 'react-scroll-parallax';

import Share from '../../main/share/share';
import Header from './components/header/header';
import StoryIntro from './components/story-intro/story-intro';
import ChapterOne from './components/01-chapter/01-chapter';
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
        <Globe
          progress={progress}
          relativePosition={{x: -30, y: 0, z: 0}}
          isSpinning={true}
          isVisible={true}
          pagesTotal={5}
          globeMovements={[
            {
              pageFrom: 1,
              pageTo: 2,
              moveBy: {x: 30, y: 0, z: 0}
            },
            {
              pageFrom: 3,
              pageTo: 4,
              moveBy: {x: 0, y: 0, z: 50}
            },
            {
              pageFrom: 4,
              pageTo: 5,
              moveBy: {x: 0, y: 80, z: -70}
            }
          ]}
        />
        <div className={styles.chapterContainer}>
          <StoryIntro
            storyStarted={storyStarted}
            onStoryStart={() => setStoryStarted(true)}
          />
          {storyStarted && (
            <>
              <Parallax onProgressChange={setProgress}>
                <ChapterOne />
              </Parallax>
            </>
          )}
        </div>
      </ParallaxProvider>
    </div>
  );
};

export default PilotStory;
