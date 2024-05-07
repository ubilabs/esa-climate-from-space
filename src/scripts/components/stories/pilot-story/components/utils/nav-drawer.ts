/**
 * Calculates the initial snap point for the mobile drawer based on the height of the handler element and the window height.
 * @param handlerRef - The reference to the handler element.
 * @returns The initial snap point value.
 */
export function getSnapPoint(handlerRef: HTMLDivElement | null) {
  if (!window.innerHeight || !handlerRef) {
    return 0.1;
  }

  const snapPoint = handlerRef.clientHeight / window.innerHeight;

  return snapPoint;
}
