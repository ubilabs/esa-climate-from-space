export const getChapterIndexFromUrl = (path: string) =>
  Number(path.split('/').pop()) ?? 0;
