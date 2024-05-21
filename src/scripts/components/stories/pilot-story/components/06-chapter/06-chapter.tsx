import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';

import {ChapterSelectionHandler} from '../../types/globe';

import Chapter from '../chapter/chapter';
import ChapterIntro from '../chapter-intro/chapter-intro';
import ChapterText, {TextPageContent} from '../chapter-text/chapter-text';
import ChapterVideo from '../chapter-video/chapter-video';
import ChapterGraph from '../chapter-graph/chapter-graph';
import ChapterConclusion from '../chapter-conclusion/chapter-conclusion';
import {subStory} from '../../config/main';

interface Props {
  onChapterSelect: ChapterSelectionHandler;
}

export interface SubStoryContent {
  id: string;
  subTitle: string;
  title: string;
  textPage1: TextPageContent;
  textPage2: TextPageContent;
  videoPage: {
    title: string;
    text: string;
    videoId: string;
    caption: string;
  };
  textPage3: TextPageContent;
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
    useState<SubStoryContent | null>(subStory[0]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentGiantId = params.get('giant');
    const selectedGiant = subStory.find(giant => giant.id === currentGiantId);
    selectedGiant && setSelectedGiantContent(selectedGiant);
  }, [location.search]);

  const handleSubStoryChange = () => {
    if (!selectedGiantContent) {
      return;
    }

    const currentIndex = subStory.indexOf(selectedGiantContent);
    const nextIndex = (currentIndex + 1) % subStory.length;
    const nextStoryIndex = subStory[nextIndex];

    const params = new URLSearchParams(location.search);
    params.set('giant', nextStoryIndex.id);
    history.push({
      pathname: '/stories/pilot/6',
      search: params.toString()
    });

    subIntroRef.current?.scrollIntoView({behavior: 'instant'});
  };

  const handleBackToStory = () => {
    storyRef.current?.scrollIntoView({behavior: 'instant'});
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
      textPage1,
      textPage2,
      textPage3,
      conclusion
    } = selectedGiantContent;

    return (
      <>
        <div ref={subIntroRef}>
          <ChapterIntro subTitle={subTitle} title={title} />
        </div>
        <ChapterText text={textPage1.text} title={textPage1.title} />
        <ChapterText text={textPage2.text} title={textPage2.title} />
        <ChapterVideo video={videoPage} />
        <ChapterText text={textPage3.text} title={textPage3.title} />
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
