export const getSlideIndexFromUrl = (): number | null => {
  const match = window.location.pathname.match(/\/slide\/(\d+)/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return null;
};
