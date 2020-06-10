// Returns if the machine is offline
export function isOffline(): boolean {
  return !navigator.onLine;
}
