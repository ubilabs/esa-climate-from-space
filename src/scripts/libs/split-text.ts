import { chunk } from "llm-chunk";

const MAX_WORDS_PER_CAPTION = 100;
const MIN_WORDS_PER_CAPTION = 40;

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
  if (!text || text.trim().length === 0) {
    return [];
  }
  // Default options
  const chunks = chunk(text, {
    minLength: minWords, // number of minimum characters into chunk
    maxLength: maxWords, // number of maximum characters into chunk
    splitter: "sentence", // paragraph | sentence
  });

  return chunks;
};

export const calculateTotalSlides = (slides: { text: string }[]): number => {
  if (!slides) return 0;
  return slides.reduce((acc, slide) => {
    const textChunks = splitTextIntoChunks(slide.text);
    return acc + textChunks.length;
  }, 0);
};
