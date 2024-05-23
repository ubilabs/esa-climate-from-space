import React, {FunctionComponent, useEffect, useState} from 'react';
import {ParallaxProvider} from 'react-scroll-parallax';

import {GlobeContextProvider} from './provider/globe-provider';

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
import NavDrawer from './components/nav-drawer/nav-drawer';
import StoryIntro from './components/story-intro/story-intro';

import {useHistory} from 'react-router-dom';
import {scrollToChapterIndex} from './components/nav-chapter-overview/nav-chapter-overview';
import {useScreenSize} from '../../../hooks/use-screen-size';

import {ChapterContextProvider} from './provider/chapter-provider';
import ChapterProgressIndication from './components/chapter-progress-indication/chapter-progress-indication';
import {
  chapters,
  globeMovementsPerChapter,
  globeMovementsPerChapterDesktop
} from './config/main';

import styles from './pilot-story.module.styl';

const PilotStory: FunctionComponent = () => {
  const [storyStarted, setStoryStarted] = useState(false);

  const {isDesktop} = useScreenSize();

  const history = useHistory();

  /**
   * Listens to changes in the browser history and scrolls to the corresponding chapter index.
   * The chapter selection based on the URL path. The rest is handled by the useChapterObserver hook.
   * @param {History} history - The browser history object.
   * @returns {Function} - The function to stop listening to history changes.
   */
  useEffect(() => {
    const unlisten = history.listen(location => {
      const chapterIndex = Number(location.pathname.split('/').pop()) ?? 0;

      scrollToChapterIndex(chapterIndex);
    });

    // Clean up the listener when the component is unmounted
    return () => {
      unlisten();
    };
  }, [history]);

  return (
    <ParallaxProvider>
      <ChapterContextProvider>
        {/* Nav Drawer DOM element - this is where the <NavDrawer/> will be rendered with React.usePortal */}
        <div id="drawer" className={styles.drawer}></div>

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
            <GlobeContextProvider>
              <Globe
                relativePosition={{x: -30, y: 0, z: 0}}
                globeMovements={
                  isDesktop
                    ? globeMovementsPerChapterDesktop
                    : globeMovementsPerChapter
                }>
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
            </GlobeContextProvider>
          </div>
          {/* Container for buttons floating above globe in touch mode */}
          <div id="floating-button-container" />

          {storyStarted && <NavDrawer />}
        </div>
      </ChapterContextProvider>
    </ParallaxProvider>
  );
};

export default PilotStory;
