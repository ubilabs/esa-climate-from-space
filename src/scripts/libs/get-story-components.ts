import { FunctionComponent } from "react";
import {
  imageGalleryModuleMap,
  StorySectionProps,
  ModuleType,
} from "../types/story";

// Map of block types to their respective module components
// Extendable map to include additional modules as needed
const moduleMap: Record<ModuleType, FunctionComponent<StorySectionProps>> = {
  ...imageGalleryModuleMap,
};

export const getModuleComponent = (moduleType: ModuleType) => {
  const ContentModule = moduleMap[moduleType]; // Correctly retrieve the component based on the formatType

  if (!ContentModule) {
    console.warn(`No module component found for type: ${moduleType}`);
    return () => null;
  }

  return ContentModule;
};
