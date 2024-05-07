import React, {FunctionComponent, useState} from 'react';
import {Parallax, ParallaxProvider} from 'react-scroll-parallax';

import {GlobeMovementDirection} from './types/globe';

import Share from '../../main/share/share';
import ChapterOne from './components/01-chapter/01-chapter';
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
