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
    let currentIntroIndex = 0;
    // const isTitleInView = chapterIntros?.some(({isInView}) => isInView);
    const navigationObserver = new IntersectionObserver(
      entries => {
        let isInView = false;
        // console.log('isTitleInView', isNewTitleInView);
        const chapterElements = parallaxController?.elements.filter(
          ({el}) => el.id === 'chapter'
        );

        const currentChapter = chapterElements?.filter(
          ({isInView}) => isInView
        )[0];
        const currentChapterIndex = Number(
          currentChapter?.el.getAttribute('data-scroll-index')
        );

        entries.forEach(entry => {
          if (entry.isIntersecting) {
            currentIntroIndex = Number(
              entry.target.getAttribute('data-scroll-index')
            );
            isInView = true;
          }
        });

        if (!isInView) {
          setSelectedChapterIndex(currentChapterIndex);
          progressIndication?.setAttribute('data-is-title-in-view', 'false');

          if (progressIndicatorHeight && chaptersLength) {
            const indicatorYOffsetInPx =
              (progressIndicatorHeight / (chaptersLength + 1)) *
                currentChapterIndex +
              currentChapterIndex * 6 +
              (progressIndicatorHeight / (chaptersLength + 1)) * progress;

            progressIndication?.style.setProperty(
              '--indicator-y-offset',
              `${indicatorYOffsetInPx}px`
            );
          }
        } else if (isInView) {
          setSelectedChapterIndex(currentIntroIndex);

          progressIndication?.setAttribute('data-is-title-in-view', 'true');
        }
      },
      {
        threshold: 1
      }
    );

    const elements = document.querySelectorAll(`.${introChapterId}`);

    elements.forEach(element => {
      navigationObserver.observe(element);
    });

    return () => {
      elements.forEach(element => {
        navigationObserver.unobserve(element);
      });
    };
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
