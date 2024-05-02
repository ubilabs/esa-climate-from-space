import React, {FunctionComponent, useState} from 'react';
import {Parallax, ParallaxProvider} from 'react-scroll-parallax';

import {GlobeMovementDirection} from './types/globe';

import Share from '../../main/share/share';
import Header from './components/header/header';
import StoryIntro from './components/story-intro/story-intro';
import ChapterOne from './components/01-chapter/01-chapter';
import Globe from './components/globe/globe';
import NavDrawer from './components/nav-drawer/nav-drawer';

import styles from './pilot-story.module.styl';

const PilotStory: FunctionComponent = () => {
  const [storyStarted, setStoryStarted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Title is visible in the Nav Drawer when it is not open, basically the handle
  const title = <h2 className={styles.header}>Chapter 1</h2>;

  // Content is visible in the Nav Drawer when it is open
  const content = (
    <div>
      <ul>
        <li>01 Chapter What is Methate</li>
        <li>02 Chapter What is Methate</li>
        <li>03 Chapter What is Methate</li>
        <li>04 Chapter What is Methate</li>
        <li>05 Chapter What is Methate</li>
      </ul>
    </div>
  );

  return (
    <div className={styles.pilotStory}>
      <Header>
        <Share />
      </Header>

      <ParallaxProvider>
        <Globe
          progress={progress}
          isSpinning={true}
          isVisible={true}
          viewTotal={4}
          globeMovement={[
            {viewFrom: 1, viewTo: 2, direction: GlobeMovementDirection.RIGHT},
            {viewFrom: 3, viewTo: 4, direction: GlobeMovementDirection.OUT}
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
      <NavDrawer handle={title} children={content} />

      {/* Nav Drawer DOM element - this is where the <NavDrawer/> will be rendered with React.usePortal */}
      <div id="drawer" className={styles.drawer}></div>
    </div>
  );
};

export default PilotStory;
