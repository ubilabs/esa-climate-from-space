import clampToRange from "./clamp-to-range";

export interface ImageSequenceSource {
  path: string;
  frameCount: number;
  prefix?: string;
  extension?: string;
  padStart?: number;
  startFrame?: number;
}

export function getImageSequenceFrameIndex(
  progress: number,
  playback: [number, number],
  frameCount: number,
): number {
  const [playbackStart, playbackEnd] = playback;

  if (frameCount <= 1) {
    return 0;
  }

  if (playbackEnd <= playbackStart) {
    return progress >= playbackEnd ? frameCount - 1 : 0;
  }

  const playbackProgress = clampToRange(
    (progress - playbackStart) / (playbackEnd - playbackStart),
    0,
    1,
  );

  return Math.round(playbackProgress * (frameCount - 1));
}

export function getImageSequenceFrameSrc(
  basePath: string,
  sequence: ImageSequenceSource,
  frameIndex: number,
): string {
  const prefix = sequence.prefix ?? "frame";
  const extension = sequence.extension ?? "webp";
  const padStart = sequence.padStart ?? 4;
  const startFrame = sequence.startFrame ?? 1;
  const frameNumber = startFrame + frameIndex;
  const normalizedBasePath = basePath.replace(/\/$/, "");

  return `${normalizedBasePath}/${prefix}-${String(frameNumber).padStart(padStart, "0")}.${extension}`;
}
