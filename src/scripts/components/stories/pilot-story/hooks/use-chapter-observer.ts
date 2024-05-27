import {useState} from 'react';
import {chapterIntroElement} from '../config/main';
import {useParallaxController} from 'react-scroll-parallax';
import {NavigationObserver} from '../components/utils/navigation-observer';
import {ChapterPosition} from '../types/globe';

const useChapterObserver = () => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [chapterPosition, setChapterPosition] = useState<ChapterPosition>(
    ChapterPosition.INTRO
  );
  const [isSubChapter, setIsSubChapter] = useState(false);

  const parallaxController = useParallaxController();

  const navigationObserver = new NavigationObserver(
    parallaxController,
    setSelectedChapterIndex,
    setChapterPosition,
    setIsSubChapter
  );
  const introElements = document.querySelectorAll(`.${chapterIntroElement}`);

  introElements.forEach(element => {
    navigationObserver.observe(element);

    return () => {
      navigationObserver.unobserve(element);
    };
  });

  return {
    selectedChapterIndex,
    setSelectedChapterIndex,
    chapterPosition,
    isSubChapter
  };
};

export default useChapterObserver;
