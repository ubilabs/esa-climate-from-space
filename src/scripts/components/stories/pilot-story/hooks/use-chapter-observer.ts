import {useEffect, useState} from 'react';
import {chapterIntroElement} from '../config/main';
import {useParallaxController} from 'react-scroll-parallax';
import {NavigationObserver} from '../components/utils/navigation-observer';
import {ChapterPosition} from '../types/globe';
import {getChapterIndexFromUrl} from '../components/utils/get-chapter-index-from-url';
import {useHistory, useLocation} from 'react-router-dom';
import {scrollToChapterIndex} from '../components/nav-chapter-overview/nav-chapter-overview';

const useChapterObserver = () => {
  const {pathname} = useLocation();
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(() =>
    getChapterIndexFromUrl(pathname)
  );

  const [chapterPosition, setChapterPosition] = useState<ChapterPosition>(
    ChapterPosition.INTRO
  );

  const history = useHistory();

  /**
   * Listens to changes in the browser history and scrolls to the corresponding chapter index.
   * The chapter selection based on the URL path. The rest is handled by the useChapterObserver hook.
   * @param {History} history - The browser history object.
   * @returns {Function} - The function to stop listening to history changes.
   */
  useEffect(() => {
    const unlisten = history.listen(({pathname}) => {
      const chapterIndex = getChapterIndexFromUrl(pathname);

      scrollToChapterIndex(chapterIndex, 'smooth');
    });

    // Clean up the listener when the component is unmounted
    return () => {
      unlisten();
    };
  }, [history]);

  const parallaxController = useParallaxController();

  const navigationObserver = new NavigationObserver(
    parallaxController,
    setSelectedChapterIndex,
    setChapterPosition
  );
  const elements = document.querySelectorAll(`.${chapterIntroElement}`);

  elements.forEach(element => {
    navigationObserver.observe(element);

    return () => {
      navigationObserver.unobserve(element);
    };
  });

  return {
    selectedChapterIndex,
    setSelectedChapterIndex,
    chapterPosition
  };
};

export default useChapterObserver;
