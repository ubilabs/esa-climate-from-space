function computeCartesianCoordinates(radius: number, angleInDegrees: number) {
  const angleInRadians = angleInDegrees * (Math.PI / 180);

  const x = radius * Math.cos(angleInRadians);
  const y = radius * Math.sin(angleInRadians);

  return { x, y };
}

/**
 * Calculates the position coordinates based on a given position and gap.
 *
 * @param pos - The position index used to calculate the angle
 * @param gap - The gap between positions in degrees
 * @returns An object containing x and y coordinates
 */
export function getNavCoordinates(
  pos: number,
  gap: number,
  radius: number,
  isMoble = false,
) {
  const angleInDegrees = pos * gap;
  const { x, y } = computeCartesianCoordinates(radius, angleInDegrees);

  // The calcuated x and y position will essentially be used as the top and left position of the absoluted positioned content entries within the content list container. By adjusting the y coordinate by 50 we vertically center the items, making sure the item in the middle is placed in center of the list
  return { x: x - (isMoble ? 0 : radius), y: y + 50 };
}
