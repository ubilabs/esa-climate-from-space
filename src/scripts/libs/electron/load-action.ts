import { PayloadAction } from "@reduxjs/toolkit";

// Tries to load an action from the filesystem
export function loadAction(
  actionType: string,
  filePath?: string,
): Promise<PayloadAction | object | null> {
  if (!window.cfs) {
    console.error("Calling electron function from a non-electron environment");
    return Promise.resolve(null);
  }

  return window.cfs.loadAction(actionType, filePath);
}
