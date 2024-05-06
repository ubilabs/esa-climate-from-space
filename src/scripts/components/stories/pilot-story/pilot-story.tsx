import React, {FunctionComponent, useState} from 'react';
import {Parallax, ParallaxProvider} from 'react-scroll-parallax';

import {GlobeMovementDirection} from './types/globe';

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
          relativePosition={{top: 0, left: -100, right: 0, bottom: 0}}
          isSpinning={true}
          isVisible={true}
          viewTotal={5}
          globeMovement={[
            {
              viewFrom: 1,
              viewTo: 2,
              directions: [GlobeMovementDirection.RIGHT]
            },
            {viewFrom: 3, viewTo: 4, directions: [GlobeMovementDirection.OUT]},
            {
              viewFrom: 4,
              viewTo: 5,
              directions: [
                GlobeMovementDirection.DOWN,
                GlobeMovementDirection.IN
              ]
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
