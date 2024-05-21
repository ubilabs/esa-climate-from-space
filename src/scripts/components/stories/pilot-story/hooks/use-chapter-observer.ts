import {useEffect, useState} from 'react';
import {chapterIntroElement} from '../config/main';
import {useParallaxController} from 'react-scroll-parallax';
import {NavigationObserver} from '../components/utils/navigation-observer';
import {ChapterType} from '../types/globe';

const useChapterObserver = (progress: number) => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [chapterType, setChapterType] = useState<ChapterType>(
    ChapterType.INTRO
  );

  const parallaxController = useParallaxController();

  useEffect(() => {
    const navigationObserver = new NavigationObserver(
      parallaxController,
      setSelectedChapterIndex,
      setChapterType
    );
    const elements = document.querySelectorAll(`.${chapterIntroElement}`);

    elements.forEach(element => {
      navigationObserver.observe(element);
    });

    return () => {
      elements.forEach(element => {
        navigationObserver.unobserve(element);
      });
    };
  }, [
    selectedChapterIndex,
    parallaxController,
    setSelectedChapterIndex,
    progress
  ]);

  return {selectedChapterIndex, setSelectedChapterIndex, chapterType};
};

export default useChapterObserver;
