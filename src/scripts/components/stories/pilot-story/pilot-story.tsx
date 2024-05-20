import React, {FunctionComponent, useEffect, useState} from 'react';
import {ParallaxProvider} from 'react-scroll-parallax';
import Share from '../../main/share/share';
import ChapterOne from './components/01-chapter/01-chapter';
import ChapterTwo from './components/02-chapter/02-chapter';
import ChapterThree from './components/03-chapter/03-chapter';
import ChapterFour from './components/04-chapter/04-chapter';
import ChapterFive from './components/05-chapter/05-chapter';
import ChapterSix from './components/06-chapter/06-chapter';
import ChapterSeven from './components/07-chapter/07-chapter';
import Globe from './components/globe/globe';
import Header from './components/header/header';
import {scrollToChapterIndex} from './components/nav-chapter-overview/nav-chapter-overview';
import NavDrawer from './components/nav-drawer/nav-drawer';
import StoryIntro from './components/story-intro/story-intro';

import {useScreenSize} from '../../../hooks/use-screen-size';

import ChapterProgressIndication from './components/chapter-progress-indication/chapter-progress-indication';
import {chapters, globeMovementsPerChapter} from './config/main';

import styles from './pilot-story.module.styl';
import {ChapterContextProvider} from './provider/chapter-provider';

const PilotStory: FunctionComponent = () => {
  const [storyStarted, setStoryStarted] = useState(false);

  // Automatically scroll to the first chapter when the story starts
  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollToChapterIndex(0);
    }, 600);

    return () => clearTimeout(timeout);
  }, [storyStarted]);

  const {isDesktop} = useScreenSize();

  return (
    <ParallaxProvider>
      <ChapterContextProvider>
        <div className={styles.pilotStory}>
          <Header>
            <Share />
          </Header>
          {isDesktop && storyStarted && (
            <ChapterProgressIndication
              chapters={chapters}
              className={styles.chapterProgressIndication}
              gap={48}
            />
          )}

          <div className={styles.storyContainer}>
            <StoryIntro
              storyStarted={storyStarted}
              onStoryStart={() => setStoryStarted(true)}
            />
            <Globe
              relativePosition={{x: -30, y: 0, z: 0}}
              isSpinning={false}
              isVisible={false}
              globeMovements={globeMovementsPerChapter}>
              {storyStarted && (
                <div className={styles.chaptersContainer}>
                  <ChapterOne chapterIndex={0} />
                  <ChapterTwo chapterIndex={1} />
                  <ChapterThree chapterIndex={2} />
                  <ChapterFour chapterIndex={3} />
                  <ChapterFive chapterIndex={4} />
                  <ChapterSix chapterIndex={5} />
                  <ChapterSeven chapterIndex={6} />
                </div>
              )}
            </Globe>
          </div>

          {storyStarted && <NavDrawer />}

          {/* Nav Drawer DOM element - this is where the <NavDrawer/> will be rendered with React.usePortal */}
          <div id="drawer" className={styles.drawer}></div>
        </div>
      </ChapterContextProvider>
    </ParallaxProvider>
  );
};

export default PilotStory;
