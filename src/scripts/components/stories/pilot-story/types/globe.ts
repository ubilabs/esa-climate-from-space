export enum GlobeMovementDirection {
  RIGHT,
  DOWN,
  OUT,
  IN
}

export type GlobeMovement = {
  viewFrom: number;
  viewTo: number;
  directions: GlobeMovementDirection[];
};
