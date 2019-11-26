import {Slide} from '../types/story';

interface Params {
  pathname: string;
  pageNumber: number;
  slides?: Slide[];
}

export const getStoryNavigation = ({pathname, pageNumber, slides}: Params) => {
  if (!slides) {
    return null;
  }

  const nextPageNumber = pageNumber + 1;
  const previousPageNumber = pageNumber - 1;
  const showNextButton = nextPageNumber < slides.length;
  const showPreviousButton = previousPageNumber >= 0;

  const pathParts = pathname.split('/');
  pathParts.pop();
  const nextPath = pathParts.concat(nextPageNumber.toString()).join('/');
  const previousPath = pathParts
    .concat(previousPageNumber.toString())
    .join('/');

  return {
    previousLink: previousPath,
    showPrevious: showPreviousButton,
    nextLink: nextPath,
    showNext: showNextButton
  };
};
