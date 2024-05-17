import React, {
  FunctionComponent,
  PropsWithChildren,
  createContext,
  useEffect,
  useState
} from 'react';
import {useHistory} from 'react-router-dom';
import {useParallaxController} from 'react-scroll-parallax';
import {introChapterId} from '../config/main';

function useChapterContext() {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);

  const history = useHistory();

  const [progress, setProgress] = useState(0);

  const parallaxController = useParallaxController();

  const chaptersLength = 7;

  const onSetProgress = () => {
    const chapterElements = parallaxController?.elements.filter(
      ({el}) => el.id === 'chapter'
    );

    // Get current chapter by retrieving first chapter element in view
    const currentChapter = chapterElements?.filter(({isInView}) => isInView)[0];

    currentChapter?.progress && setProgress(currentChapter?.progress);
  };

  const progressIndication = document.getElementById('progress-indication');

  const progressIndicatorHeight = progressIndication?.offsetHeight;

  useEffect(() => {
    const chapterElements = parallaxController?.elements.filter(
      ({el}) => el.id === 'chapter'
    );

    // Get current chapter by retrieving first chapter element in view
    const currentChapter = chapterElements?.filter(({isInView}) => isInView)[0];

    const chapterIntros = parallaxController?.elements.filter(({el}) =>
      el.classList.contains(introChapterId)
    );

    const currentIntro = chapterIntros?.filter(({isInView}) => isInView)[0];

    const currentIntroIndex = Number(
      currentIntro?.el.getAttribute('data-scroll-index')
    );

    const currentChapterIndex = Number(
      currentChapter?.el.getAttribute('data-scroll-index')
    );
    const isTitleInView = chapterIntros?.some(({isInView}) => isInView);

    if (currentIntroIndex) {
      setSelectedChapterIndex(currentIntroIndex);
    } else if (currentChapterIndex) {
      setSelectedChapterIndex(currentChapterIndex);
    }

    if (isTitleInView && selectedChapterIndex === currentIntroIndex) {
      progressIndication?.setAttribute('data-is-title-in-view', 'true');
    } else if (!isTitleInView && selectedChapterIndex === currentChapterIndex) {
      progressIndication?.setAttribute('data-is-title-in-view', 'false');

      if (progressIndicatorHeight && chaptersLength) {
        const indicatorYOffsetInPx =
          ((progressIndicatorHeight * 1.25) / (chaptersLength + 1)) *
            selectedChapterIndex +
          (progressIndicatorHeight / (chaptersLength + 1)) * progress;

        progressIndication?.style.setProperty(
          '--indicator-y-offset',
          `${indicatorYOffsetInPx}px`
        );
      }
    }
  }, [
    progress,
    selectedChapterIndex,
    chaptersLength,
    progressIndicatorHeight,
    progressIndication,
    parallaxController
  ]);

  useEffect(() => {
    history.replace(`/stories/pilot/${selectedChapterIndex + 1}`);
  }, [selectedChapterIndex, history]);

  return {selectedChapterIndex, setSelectedChapterIndex, onSetProgress};
}

export const ChapterContext = createContext(
  {} as ReturnType<typeof useChapterContext>
);

export const ChapterContextProvider: FunctionComponent<PropsWithChildren> = ({
  children
}): React.ReactElement | null => {
  const value = useChapterContext();
  return (
    <ChapterContext.Provider value={value}>{children}</ChapterContext.Provider>
  );
};
