// Returns if environment is electron
export function isElectron(): boolean {
  return Boolean(
    window.cfs &&
      typeof window.cfs === 'object' &&
      window.cfs.isElectron === true
  );
}
