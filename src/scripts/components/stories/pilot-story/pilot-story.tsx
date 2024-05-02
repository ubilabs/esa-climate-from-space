import React, {FunctionComponent, useState} from 'react';
import {ParallaxProvider} from 'react-scroll-parallax';

import Share from '../../main/share/share';
import Header from './components/header/header';
import StoryIntro from './components/story-intro/story-intro';
import ChapterOne from './components/01-chapter/01-chapter';

import styles from './pilot-story.module.styl';

const PilotStory: FunctionComponent = () => {
  const [storyStarted, setStoryStarted] = useState(false);

  return (
    <div className={styles.pilotStory}>
      <Header>
        <Share />
      </Header>

      <ParallaxProvider>
        <div className={styles.chapterContainer}>
          <StoryIntro
            storyStarted={storyStarted}
            onStoryStart={() => setStoryStarted(true)}
          />

          {storyStarted && <ChapterOne />}
        </div>
      </ParallaxProvider>
    </div>
  );
};

export default PilotStory;
