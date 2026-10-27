import clampToRange from "./clamp-to-range";

export interface ImageSequenceSource {
  path: string;
}

export interface ImageSequenceManifest {
  frameCount: number;
  format?: string | null;
  width?: number | null;
  height?: number | null;
}

export type ImageSequenceVariant = "landscape" | "portrait";

export function getImageSequenceFrameIndex(
  progress: number,
  progressRange: [number, number],
  frameCount: number,
): number {
  const [rangeStart, rangeEnd] = progressRange;

  if (frameCount <= 1) {
    return 0;
  }

  if (rangeEnd <= rangeStart) {
    return progress >= rangeEnd ? frameCount - 1 : 0;
  }

  const rangeProgress = clampToRange(
    (progress - rangeStart) / (rangeEnd - rangeStart),
    0,
    1,
  );

  return Math.round(rangeProgress * (frameCount - 1));
}

export function getImageSequenceFrameSrc(
  basePath: string,
  frameIndex: number,
): string {
  const normalizedBasePath = basePath.replace(/\/$/, "");
  const frameNumber = frameIndex + 1;

  return `${normalizedBasePath}/frame-${String(frameNumber).padStart(4, "0")}.webp`;
}

export function getImageSequenceBasePath(
  basePath: string,
  variant: ImageSequenceVariant,
): string {
  return `${basePath.replace(/\/$/, "")}/${variant}`;
}

export function getImageSequenceManifestSrc(
  basePath: string,
  variant: ImageSequenceVariant,
): string {
  return `${getImageSequenceBasePath(basePath, variant)}/image-sequence.json`;
}
