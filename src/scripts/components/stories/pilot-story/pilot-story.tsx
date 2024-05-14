import React, {FunctionComponent, useState} from 'react';
import {Parallax, ParallaxProvider} from 'react-scroll-parallax';

import Share from '../../main/share/share';
import ChapterOne from './components/01-chapter/01-chapter';
import ChapterTwo from './components/02-chapter/02-chapter';
import ChapterThree from './components/03-chapter/03-chapter';
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

import styles from './pilot-story.module.styl';

const chapters = [
  {title: 'The invisible threat', subtitle: 'Subtitle for chapter 1'},
  {title: 'Where does methane come from?', subtitle: 'Subtitle for chapter 2'},
  {title: 'ESA`s Watchful EyesOver Earth', subtitle: 'Subtitle for chapter 3'},
  {title: 'Resolution Matters', subtitle: 'Subtitle for chapter 4'},
  {
    title: 'Unveiling Methane Super Emitters',
    subtitle: 'Subtitle for chapter 5'
  },
  {
    title: '10 largest methane leaks on record',
    subtitle: 'Subtitle for chapter 6'
  },
  {
    title: 'Strategic choices for our future',
    subtitle: 'Subtitle for chapter 7'
  }
];

const globeMovements = [
  // chapter 1
  {
    pageFrom: 1,
    pageTo: 2,
    moveBy: {x: 30, y: 0, z: 0}
  },
  {
    pageFrom: 2,
    pageTo: 3,
    moveBy: {x: 0, y: 0, z: 30}
  },
  {
    pageFrom: 3,
    pageTo: 4,
    moveBy: {x: 0, y: 0, z: 10}
  },
  // chapter 2
  {
    pageFrom: 4,
    pageTo: 5,
    moveBy: {x: 0, y: 40, z: -50}
  },
  {
    pageFrom: 5,
    pageTo: 6,
    moveBy: {x: 0, y: 5, z: 0}
  },
  {
    pageFrom: 6,
    pageTo: 7,
    moveBy: {x: 0, y: 5, z: 0}
  },
  {
    pageFrom: 7,
    pageTo: 8,
    moveBy: {x: 0, y: 5, z: 0}
  },
  {
    pageFrom: 8,
    pageTo: 9,
    moveBy: {x: 0, y: 5, z: 0}
  },
  {
    pageFrom: 9,
    pageTo: 10,
    moveBy: {x: 0, y: -62, z: 50}
  },
  {
    pageFrom: 10,
    pageTo: 11,
    moveBy: {x: 0, y: 0, z: -40}
  },
  // chapter 3
  {
    pageFrom: 11,
    pageTo: 12,
    moveBy: {x: 80, y: 0, z: -15}
  },
  {
    pageFrom: 12,
    pageTo: 13,
    moveBy: {x: 5, y: 0, z: 0}
  },
  {
    pageFrom: 13,
    pageTo: 14,
    moveBy: {x: 5, y: 0, z: 0}
  },
  {
    pageFrom: 14,
    pageTo: 15,
    moveBy: {x: 5, y: 0, z: 0}
  },
  {
    pageFrom: 15,
    pageTo: 16,
    moveBy: {x: 30, y: 0, z: -7}
  },
  {
    pageFrom: 16,
    pageTo: 17,
    moveBy: {x: -10, y: 0, z: 1}
  },
  {
    pageFrom: 17,
    pageTo: 18,
    moveBy: {x: -40, y: 0, z: 5}
  }
];

const PilotStory: FunctionComponent = () => {
  const [storyStarted, setStoryStarted] = useState(false);
  const [progress, setProgress] = useState(0);

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
        <Globe
          progress={progress}
          relativePosition={{x: -30, y: 0, z: 0}}
          isSpinning={true}
          isVisible={true}
          pagesTotal={18}
          globeMovements={globeMovements}
        />
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
          {storyStarted && (
            <>
              <Parallax onProgressChange={setProgress}>
                <ChapterOne
                  onChapterSelect={() => setSelectedChapterIndex(0)}
                />
                <ChapterTwo
                  onChapterSelect={() => setSelectedChapterIndex(1)}
                />
                <ChapterThree
                  onChapterSelect={() => setSelectedChapterIndex(2)}
                />
              </Parallax>
            </>
          )}
        </div>
      </ParallaxProvider>
      {storyStarted && <NavDrawer handle={title} children={content} />}

      {/* Nav Drawer DOM element - this is where the <NavDrawer/> will be rendered with React.usePortal */}
      <div id="drawer" className={styles.drawer}></div>
    </div>
  );
};

export default PilotStory;