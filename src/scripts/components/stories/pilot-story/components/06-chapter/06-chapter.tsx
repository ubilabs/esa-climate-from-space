import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';

import {getMarkerHtml} from '../../../../main/globe/get-marker-html';

import {subStory} from '../../config/main';

import Chapter from '../chapter/chapter';
import ChapterIntro from '../chapter-intro/chapter-intro';
import ChapterText, {TextPageContent} from '../chapter-text/chapter-text';
import ChapterVideo from '../chapter-video/chapter-video';
import ChapterGraph from '../chapter-graph/chapter-graph';
import ChapterConclusion from '../chapter-conclusion/chapter-conclusion';
import ChapterMarkers from '../chapter-markers/chapter-markers';

interface Props {
  chapterIndex: number;
}

export interface SubStoryContent {
  id: string;
  subTitle: string;
  title: string;
  location: {lat: number; lng: number};
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

const ChapterSix: FunctionComponent<Props> = ({chapterIndex}) => {
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

  const handleSubStoryChange = (subStoryId?: string) => {
    if (!selectedGiantContent) {
      return;
    }

    const params = new URLSearchParams(location.search);

    if (!subStoryId) {
      const currentIndex = subStory.indexOf(selectedGiantContent);
      const nextIndex = (currentIndex + 1) % subStory.length;
      const nextStoryIndex = subStory[nextIndex];

      params.set('giant', nextStoryIndex.id);
    } else {
      params.set('giant', subStoryId);
    }

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
          <ChapterIntro
            subTitle={subTitle}
            title={title}
            scrollIndex={6}
            onBackToStory={handleBackToStory}
          />
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
    <Chapter scrollIndex={chapterIndex}>
      <div ref={storyRef}>
        <ChapterIntro
          scrollIndex={chapterIndex}
          subTitle="Chapter 6: Mapping the Methane Giants"
          title="10 largest methane leaks on record"
        />
      </div>
      <ChapterMarkers
        markers={subStory.map(({id, title, location: latLng}) => ({
          id,
          html: getMarkerHtml(title),
          onClick: () => {
            handleSubStoryChange(id);
          },
          offset: [0, 0],
          ...latLng
        }))}
        onBackToStory={() => handleBackToStory()}
      />
      {selectedGiantContent && renderSubstory()}
    </Chapter>
  );
};

export default ChapterSix;
