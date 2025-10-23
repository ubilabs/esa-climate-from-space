export const calculateTotalSlides = (slides: { text: string }[]): number => {
  if (!slides) return 0;
  return slides.length;
};
