import {Slide} from '../types/story';
import {useLocation} from 'react-router-dom';

export const useStoryNavigation = (slides: Slide[], currentPage: number) => {
  const location = useLocation();
  const nextPageNumber = currentPage + 1;
  const previousPageNumber = currentPage - 1;
  const showNextButton = nextPageNumber < slides.length;
  const showPreviousButton = previousPageNumber >= 0;

  const pathParts = location.pathname.split('/');
  pathParts.pop();
  const nextPath = pathParts.concat(nextPageNumber.toString()).join('/');
  const previousPath = pathParts
    .concat(previousPageNumber.toString())
    .join('/');

  return {
    previous: previousPath,
    showPrevious: showPreviousButton,
    next: nextPath,
    showNext: showNextButton
  };
};
