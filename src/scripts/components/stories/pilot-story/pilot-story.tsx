import React, {
  FunctionComponent,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import {ParallaxProvider} from 'react-scroll-parallax';
import cx from 'classnames';

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
  const [scrollEl, setScrollElement] = useState<HTMLDivElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  // sets scroll container for parallax
  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }
    setScrollElement(ref.current);
  }, []);

  return (
    <div className={styles.pilotStory}>
      <Header>
        <Share />
      </Header>

      <div className={styles.storyContainer} ref={ref}>
        {scrollEl && (
          <ParallaxProvider scrollContainer={scrollEl}>
            <ChapterContextProvider>
              {isDesktop && storyStarted && (
                <ChapterProgressIndication
                  chapters={chapters}
                  className={styles.chapterProgressIndication}
                  gap={48}
                />
              )}

              <GlobeContextProvider>
                <Globe
                  relativePosition={{x: -30, y: 0, z: 0}}
                  globeMovements={
                    isDesktop
                      ? globeMovementsPerChapterDesktop
                      : globeMovementsPerChapter
                  }>
                  <div className={styles.chaptersContainer}>
                    <StoryIntro
                      storyStarted={storyStarted}
                      onStoryStart={() => setStoryStarted(true)}
                    />
                    {storyStarted && (
                      <>
                        <ChapterOne chapterIndex={0} />
                        <ChapterTwo chapterIndex={1} />
                        <ChapterThree chapterIndex={2} />
                        <ChapterFour chapterIndex={3} />
                        <ChapterFive chapterIndex={4} />
                        <ChapterSix chapterIndex={5} />
                        <ChapterSeven chapterIndex={6} />
                      </>
                    )}
                  </div>
                </Globe>
              </GlobeContextProvider>
              {/* Container for buttons floating above globe in touch mode */}
              <div id="floating-button-container" />
              <NavDrawer />
              {/* Nav Drawer DOM element - this is where the <NavDrawer/> will be rendered with React.usePortal */}
              <div
                id="drawer"
                className={cx(
                  styles.drawer,
                  storyStarted && styles.navVisible
                )}></div>
            </ChapterContextProvider>
          </ParallaxProvider>
        )}
      </div>
    </div>
  );
};

export default PilotStory;
