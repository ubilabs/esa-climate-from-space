const MAX_WORDS_PER_CAPTION = 40;
const MIN_WORDS_PER_CAPTION = 5;

/**
 * Splits a given text into chunks based on the maximum and minimum word limits.
 * We then allocate each chunk to a separate story slide, making sure text does not overflow
 *
 * @param {string} text - The input text to be split into chunks.
 * @param {number} [maxWords=MAX_WORDS_PER_CAPTION] - The maximum number of words allowed in a chunk.
 * @param {number} [minWords=MIN_WORDS_PER_CAPTION] - The minimum number of words allowed in the last chunk.
 * @returns {string[]} An array of text chunks adhering to the specified word limits.
 */
export const splitTextIntoChunks = (
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
    const textChunks = splitTextIntoChunks(slide.text);
    return acc + textChunks.length;
  }, 0);
};
