const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov"];

export const isVideo = (url?: string) => {
  return VIDEO_EXTENSIONS.some((ext) => url?.toLowerCase().includes(ext));
};
