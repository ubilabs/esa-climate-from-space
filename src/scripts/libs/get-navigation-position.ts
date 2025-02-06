function computeCartesianCoordinates(radius: number, angleInDegrees: number) {
  const angleInRadians = angleInDegrees * (Math.PI / 180);

  const x = radius * Math.cos(angleInRadians);
  const y = radius * Math.sin(angleInRadians);

  return {x, y};
}

/**
 * Calculates the position coordinates based on a given position and gap.
 *
 * @param pos - The position index used to calculate the angle
 * @param gap - The gap between positions in degrees
 * @returns An object containing x and y coordinates
 */
export function getNavCoordinates(pos: number, gap: number, radius: number) {
  const angleInDegrees = pos * gap;
  const {x, y} = computeCartesianCoordinates(radius, angleInDegrees);

  return {x, y: y + 50};
}
