// Removes the offline folder of the given id
export function deleteId(id: string): void {
  if (!window.cfs) {
    console.error('Calling electron function from a non-electron enviroment');
    return;
  }

  window.cfs.deleteId(id);
}
