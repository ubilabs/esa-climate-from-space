import {useState} from 'react';
import {chapterIntroElement} from '../config/main';
import {useParallaxController} from 'react-scroll-parallax';
import {NavigationObserver} from '../components/utils/navigation-observer';
import {ChapterType} from '../types/globe';

const useChapterObserver = () => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [chapterType, setChapterType] = useState<ChapterType>(
    ChapterType.INTRO
  );

  const parallaxController = useParallaxController();

  const navigationObserver = new NavigationObserver(
    parallaxController,
    setSelectedChapterIndex,
    setChapterType
  );
  const elements = document.querySelectorAll(`.${chapterIntroElement}`);

  elements.forEach(element => {
    navigationObserver.observe(element);

    return () => {
      navigationObserver.unobserve(element);
    };
  });

  return {selectedChapterIndex, setSelectedChapterIndex, chapterType};
};

export default useChapterObserver;
