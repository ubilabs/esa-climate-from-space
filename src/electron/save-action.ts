import * as fs from "fs";
import * as path from "path";
import { app } from "electron";
import { AnyAction } from "@reduxjs/toolkit";

/**
 * Saves an action for offline usage
 */
function saveAction(action: AnyAction) {
  const type = action.meta?.arg?.endpointName.toLowerCase();
  const downloadsPath = app.getPath("downloads");
  const actionsPath = path.join(downloadsPath, "actions");
  const filePath = path.join(actionsPath, type);
  const content = JSON.stringify(action, null, 2);

  fs.mkdirSync(actionsPath, { recursive: true });

  fs.writeFile(filePath, content, "utf8", (err) => {
    if (err) {
      console.log(err);
    }
    console.log("Saved action to", filePath);
  });
}

export default saveAction;
