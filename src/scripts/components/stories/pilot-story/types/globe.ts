export enum GlobeMovementDirection {
  RIGHT,
  DOWN,
  OUT
}

export type GlobeMovement = {
  viewFrom: number;
  viewTo: number;
  direction: GlobeMovementDirection;
};
