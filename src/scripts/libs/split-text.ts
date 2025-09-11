const MAX_WORDS_PER_CAPTION = 40;
const MIN_WORDS_PER_CAPTION = 5;

export const splitText = (
  text: string,
  maxWords: number = MAX_WORDS_PER_CAPTION,
  minWords: number = MIN_WORDS_PER_CAPTION,
): string[] => {
  if (!text) return [];
  const words = text.split(" ");
  const n = words.length;
  if (n <= maxWords) {
    return [text];
  }

  const chunks = [];
  let currentPos = 0;
  while (currentPos < n) {
    let endPos = currentPos + maxWords;
    if (endPos >= n) {
      endPos = n;
    } else if (n - endPos < minWords) {
      const remainingWords = n - currentPos;
      endPos = currentPos + Math.ceil(remainingWords / 2);
    }
    chunks.push(words.slice(currentPos, endPos).join(" "));
    currentPos = endPos;
  }
  return chunks;
};

export const calculateTotalSlides = (slides: { text: string }[]): number => {
  if (!slides) return 0;
  return slides.reduce((acc, slide) => {
    const textChunks = splitText(slide.text);
    return acc + textChunks.length;
  }, 0);
};
