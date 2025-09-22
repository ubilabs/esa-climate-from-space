import { chunk } from "llm-chunk";

const MAX_WORDS_PER_CAPTION = 1000;
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

  const linkMap: { [key: string]: string } = {};
  let linkIndex = 0;

  // Protect markdown links by replacing them with placeholders
  const protectedText = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match) => {
    const placeholder = `__MARKDOWN_LINK_${linkIndex++}__`;
    linkMap[placeholder] = match;
    return placeholder;
  });

  // Default options
  const chunks = chunk(protectedText, {
    minLength: minWords, // number of minimum characters into chunk
    maxLength: maxWords, // number of maximum characters into chunk
    splitter: "sentence", // paragraph | sentence
  });

  const restoredChunks = chunks.map((c) => {
    return Object.keys(linkMap).reduce((acc, placeholder) => {
      return acc.replace(new RegExp(placeholder, "g"), linkMap[placeholder]);
    }, c);
  });

  // Avoid very short last chunks by merging them with the previous chunk
  return restoredChunks.reduce((acc, chunk) => {
    const wordCount = chunk.split(/\s+/).filter(Boolean).length;
    if (acc.length > 0 && wordCount < 5) {
      acc[acc.length - 1] += ` ${chunk}`;
    } else {
      acc.push(chunk);
    }
    return acc;
  }, [] as string[]);
};

export const calculateTotalSlides = (slides: { text: string }[]): number => {
  if (!slides) return 0;
  return slides.reduce((acc, slide) => {
    const textChunks = splitTextIntoChunks(slide.text);
    return acc + textChunks.length;
  }, 0);
};
