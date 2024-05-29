import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';

import {getMarkerHtml} from '../../../../main/globe/get-marker-html';

import {globeElement, subStory} from '../../config/main';

import Chapter from '../chapter/chapter';
import ChapterIntro from '../chapter-intro/chapter-intro';
import ChapterText, {TextPageContent} from '../chapter-text/chapter-text';
import ChapterVideo from '../chapter-video/chapter-video';
import ChapterGraph from '../chapter-graph/chapter-graph';
import ChapterConclusion from '../chapter-conclusion/chapter-conclusion';
import ChapterMarkers from '../chapter-markers/chapter-markers';
import useIsInViewport from '../../hooks/use-is-in-viewport';
import ScrollHint from '../scroll-hint/scroll-hint';

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

  // This ref is used to check if the user has scrolled to the top overview section
  // If so, the selected giant content will be reset
  const inViewRef = useRef<HTMLDivElement>(null);
  const [selectedGiantContent, setSelectedGiantContent] =
    useState<SubStoryContent | null>(null);

  const inView = useIsInViewport(inViewRef, 0.1);

  useEffect(() => {
    const globe = document.getElementById(globeElement);
    if (inView) {
      setSelectedGiantContent(null);

      // Set globe opacity to 1
      if (globe) {
        globe.style.opacity = '1';
      }
    }

    return () => {
      // Reset globe opacity to 0.8
      if (globe) {
        globe.style.opacity = '0.8';
      }
    };
  }, [inView]);

  const handleSubStoryChange = (subStoryId?: string) => {
    if (!subStoryId) {
      const currentIndex =
        (selectedGiantContent && subStory.indexOf(selectedGiantContent)) || 0;

      const nextIndex = (currentIndex + 1) % subStory.length;

      setSelectedGiantContent(subStory[nextIndex]);
    } else {
      const selectedGiant = subStory.find(giant => giant.id === subStoryId);

      if (selectedGiant) {
        const params = new URLSearchParams(location.search);

        params.set('subStoryId', subStoryId);
        history.push({
          pathname: '/stories/pilot/6',
          search: params.toString()
        });

        setSelectedGiantContent(selectedGiant);
      }
    }
  };

  useEffect(() => {
    if (!selectedGiantContent) {
      return;
    }

    subIntroRef.current?.scrollIntoView({behavior: 'instant'});
  }, [selectedGiantContent]);

  const handleBackToStory = () => {
    storyRef.current?.scrollIntoView({behavior: 'instant'});
  };

  const renderSubstory = (giant: SubStoryContent) => {
    const {
      subTitle,
      title,
      videoPage,
      graphPage,
      textPage1,
      textPage2,
      textPage3,
      conclusion
    } = giant;

    return (
      <Chapter scrollIndex={0} isSubChapter>
        <div ref={subIntroRef}>
          <ChapterIntro
            subTitle={subTitle}
            title={title}
            scrollIndex={0}
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
      </Chapter>
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
      <div ref={inViewRef} aria-hidden="true"></div>
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
      <ScrollHint />
      {selectedGiantContent && renderSubstory(selectedGiantContent)}
    </Chapter>
  );
};

export default ChapterSix;
