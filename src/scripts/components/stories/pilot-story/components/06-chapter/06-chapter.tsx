import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';

import {ChapterSelectionHandler} from '../../types/globe';

import Chapter from '../chapter/chapter';
import ChapterIntro from '../chapter-intro/chapter-intro';
import ChapterText, {TextPageContent} from '../chapter-text/chapter-text';
import ChapterVideo from '../chapter-video/chapter-video';
import ChapterGraph from '../chapter-graph/chapter-graph';
import ChapterConclusion from '../chapter-conclusion/chapter-conclusion';
import {giantsStory} from '../../config/06-config';

interface Props {
  onChapterSelect: ChapterSelectionHandler;
}

export interface GiantContent {
  id: string;
  subTitle: string;
  title: string;
  textSections: TextPageContent[];
  videoPage: {
    title: string;
    text: string;
    videoId: string;
    caption: string;
  };
  textSectionShort: TextPageContent[];
  graphPage: {
    title: string;
    src: string;
    alt: string;
    caption: string;
  };
  conclusion: string;
}

const ChapterSix: FunctionComponent<Props> = ({onChapterSelect}) => {
  const history = useHistory();
  const location = useLocation();
  const storyRef = useRef<HTMLDivElement>(null);
  const subIntroRef = useRef<HTMLDivElement>(null);
  const [selectedGiantContent, setSelectedGiantContent] =
    useState<GiantContent | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentGiantId = params.get('giant');
    const selectedGiant = giantsStory.find(
      giant => giant.id === currentGiantId
    );
    selectedGiant && setSelectedGiantContent(selectedGiant);
  }, [location.search]);

  const handleSubStoryChange = () => {
    if (!selectedGiantContent) {
      return;
    }
    const currentIndex = giantsStory.indexOf(selectedGiantContent);
    const nextStory = giantsStory[currentIndex + 1];

    if (nextStory) {
      const params = new URLSearchParams(location.search);
      params.set('giant', nextStory.id);
      history.push({
        pathname: '/stories/pilot/6',
        search: params.toString()
      });

      subIntroRef.current?.scrollIntoView({behavior: 'smooth'});
    }
  };

  const handleBackToStory = () => {
    setSelectedGiantContent(null);
    storyRef.current?.scrollIntoView({behavior: 'smooth'});
  };

  const renderSubstory = () => {
    if (!selectedGiantContent) {
      return null;
    }

    const {
      subTitle,
      title,
      videoPage,
      graphPage,
      textSections,
      textSectionShort,
      conclusion
    } = selectedGiantContent;

    return (
      <>
        <div ref={subIntroRef}>
          <ChapterIntro subTitle={subTitle} title={title} />
        </div>
        <ChapterText text={textSections} snapPosition="start" />
        <ChapterVideo video={videoPage} />
        <ChapterText text={textSectionShort} snapPosition="start" />
        <ChapterGraph graph={graphPage} />
        <ChapterConclusion
          text={conclusion}
          onBackToStory={() => handleBackToStory()}
          onNextStory={() => handleSubStoryChange()}
        />
      </>
    );
  };

  return (
    <Chapter scrollIndex={5} parallaxProps={onChapterSelect}>
      <div ref={storyRef}>
        <ChapterIntro
          subTitle="Chapter 6: Mapping the Methane Giants"
          title="10 largest methane leaks on record"
        />
      </div>
      <ChapterText text="Space for Globe with markers" />
      {selectedGiantContent && renderSubstory()}
    </Chapter>
  );
};

export default ChapterSix;
