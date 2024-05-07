export enum GlobeMovementDirection {
  RIGHT,
  DOWN,
  OUT,
  IN
}

export type GlobeMovement = {
  pageFrom: number;
  pageTo: number;
  // Extend in percentage
  relativeExtend: number;
  direction: GlobeMovementDirection;
};
