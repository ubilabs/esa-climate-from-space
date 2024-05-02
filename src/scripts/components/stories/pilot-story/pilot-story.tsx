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
        <Globe progress={progress} isSpinning={true} />
        <div className={styles.chapterContainer}>
          <StoryIntro
            storyStarted={storyStarted}
            onStoryStart={() => setStoryStarted(true)}
          />

          {storyStarted && (
            <>
              <Parallax
                onProgressChange={progress =>
                  // convert progress to percentage
                  setProgress(Math.round(progress * 100 * 2))
                }>
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
