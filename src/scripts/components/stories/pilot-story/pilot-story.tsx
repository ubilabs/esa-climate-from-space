import React, {FunctionComponent, useState} from 'react';
import {ParallaxProvider} from 'react-scroll-parallax';

import Share from '../../main/share/share';
import ChapterOne from './components/01-chapter/01-chapter';
import ChapterTwo from './components/02-chapter/02-chapter';
import ChapterThree from './components/03-chapter/03-chapter';
import ChapterFour from './components/04-chapter/04-chapter';
import ChapterFive from './components/05-chapter/05-chapter';
import ChapterSix from './components/06-chapter/06-chapter';
import Globe from './components/globe/globe';
import Header from './components/header/header';
import NavChapterOverview from './components/nav-chapter-overview/nav-chapter-overview';
import NavDrawer from './components/nav-drawer/nav-drawer';
import StoryIntro from './components/story-intro/story-intro';

import {useScreenSize} from '../../../hooks/use-screen-size';
import {GlobeExploreIcon} from './components/icons/globe-explore-icon';
import {GlobeIcon} from '../../main/icons/globe-icon';
import Button from './components/button/button';
import ChapterProgressIndication from './components/chapter-progress-indication/chapter-progress-indication';
import {chapters, globeMovements} from './config/main';

import styles from './pilot-story.module.styl';

const PilotStory: FunctionComponent = () => {
  const [storyStarted, setStoryStarted] = useState(false);

  const {isDesktop} = useScreenSize();

  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);

  // Title is visible in the Nav Drawer when it is not open, basically the handle
  const title = (
    <h2 className={styles.header}>{chapters[selectedChapterIndex].subtitle}</h2>
  );

  // Content is visible in the Nav Drawer when it is open
  const content = (
    <div className={styles.navContainer}>
      <NavChapterOverview
        chapters={chapters}
        setSelectedChapterIndex={(index: number) =>
          setSelectedChapterIndex(index)
        }
        selectedChapterIndex={selectedChapterIndex}
      />
      <Button
        link={'/stories'}
        icon={GlobeIcon}
        label="Back to Stories"
        className={styles.navLinks}
      />
      <Button
        link={'/'}
        className={styles.navLinks}
        icon={GlobeExploreIcon}
        label="explore the story datasets"
      />
    </div>
  );

  return (
    <div className={styles.pilotStory}>
      <Header>
        <Share />
      </Header>

      <ParallaxProvider>
        {isDesktop && storyStarted && (
          <ChapterProgressIndication
            chapters={chapters}
            selectedChapterIndex={selectedChapterIndex}
            className={styles.chapterProgressIndication}
            gap={48}
          />
        )}

        <div className={styles.chapterContainer}>
          <StoryIntro
            storyStarted={storyStarted}
            onStoryStart={() => setStoryStarted(true)}
          />
          <Globe
            relativePosition={{x: -30, y: 0, z: 0}}
            isSpinning={true}
            isVisible={true}
            pagesTotal={18}
            globeMovements={globeMovements}>
            {storyStarted && (
              <>
                <ChapterOne
                  onChapterSelect={() => setSelectedChapterIndex(0)}
                />
                <ChapterTwo
                  onChapterSelect={() => setSelectedChapterIndex(1)}
                />
                <ChapterThree
                  onChapterSelect={() => setSelectedChapterIndex(2)}
                />
                <ChapterFour
                  onChapterSelect={() => setSelectedChapterIndex(4)}
                />
                <ChapterFive
                  onChapterSelect={() => setSelectedChapterIndex(5)}
                />
                <ChapterSix
                  onChapterSelect={() => setSelectedChapterIndex(6)}
                />
              </>
            )}
          </Globe>
        </div>
      </ParallaxProvider>
      {storyStarted && <NavDrawer handle={title} children={content} />}

      {/* Nav Drawer DOM element - this is where the <NavDrawer/> will be rendered with React.usePortal */}
      <div id="drawer" className={styles.drawer}></div>
    </div>
  );
};

export default PilotStory;
