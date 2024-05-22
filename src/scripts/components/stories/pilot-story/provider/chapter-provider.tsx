import React, {
  FunctionComponent,
  PropsWithChildren,
  createContext,
  useEffect,
  useState
} from 'react';
import {useHistory} from 'react-router-dom';
import {useParallaxController} from 'react-scroll-parallax';
import useIntersectChapters from '../hooks/use-chapter-observer';
import {chapterMainElement} from '../config/main';

function useChapterContext() {
  // Progress of the current chapter
  const [progress, setProgress] = useState(0);

  const history = useHistory();

  const parallaxController = useParallaxController();

  // Hook to handle the selected chapter index based on the current chapter in view
  // and the progress indication of the current chapter
  const {selectedChapterIndex, setSelectedChapterIndex, chapterPosition} =
    useIntersectChapters();

  /**
   * Sets the progress based on the current chapter element in view.
   * Is called when the progress of the chapter changes.
   */
  const onSetProgress = () => {
    const chapterElements = parallaxController?.elements.filter(
      ({el}) => el.id === chapterMainElement
    );

    // Get current chapter by retrieving first chapter element in view
    const currentChapter = chapterElements?.filter(({isInView}) => isInView)[0];

    currentChapter?.progress && setProgress(currentChapter?.progress);
  };

  useEffect(() => {
    history.replace(`/stories/pilot/${selectedChapterIndex + 1}`);
  }, [selectedChapterIndex, history]);

  return {
    selectedChapterIndex,
    setSelectedChapterIndex,
    onSetProgress,
    chapterPosition,
    progress
  };
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
