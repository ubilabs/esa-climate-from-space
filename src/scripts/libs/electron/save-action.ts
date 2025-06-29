import { PayloadAction } from "@reduxjs/toolkit";

// Saves an action for offline usage
export function saveAction(action: PayloadAction): void {
  if (!window.cfs) {
    console.error("Calling electron function from a non-electron environment");
    return;
  }

  window.cfs.saveAction(action);
}
