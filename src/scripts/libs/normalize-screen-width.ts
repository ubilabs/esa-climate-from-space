export function getNormalizedScreenWidth(baseWidth = 1440): number {
  if (typeof window === "undefined") return 1;
  return baseWidth / window.innerWidth;
}
