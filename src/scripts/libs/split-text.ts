export const MAX_WORDS_PER_CAPTION = 40;
export const MIN_WORDS_PER_CAPTION = 5;

export const splitText = (
  text: string,
  maxWords: number,
  minWords: number,
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
