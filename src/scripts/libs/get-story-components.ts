import { FunctionComponent, ReactNode } from "react";
import {
  ImageGallery,
  ImageGalleryCompoundComponents,
} from "../components/stories/story/blocks/image-gallery/image-gallery";
import {
  BlockType,
  imageGalleryModuleMap,
  StorySectionProps,
  ModuleType,
} from "../types/story";

// Map of content block types to their respective components
// Add further components here as needed
const contentBlockMap:
  | Record<
      string,
      FunctionComponent<{ children: ReactNode }> &
        ImageGalleryCompoundComponents
    >
  | undefined = {
  imageGallery: ImageGallery,
};

// Map of block types to their respective module components
// Extendable map to include additional modules as needed
const moduleMap: Record<
  ModuleType,
  FunctionComponent<StorySectionProps>
> = {
  ...imageGalleryModuleMap,
};

export const getBlockComponent = (contentBlockType: BlockType) => {
  const BlockComponent = contentBlockMap[contentBlockType];

  if (!BlockComponent) {
    console.warn(
      `No block component found for block type: ${contentBlockType}`,
    );

    return () => null;
  }

  return BlockComponent;
};

export const getModuleComponent = (moduleType: ModuleType) => {
  const ContentModule = moduleMap[moduleType]; // Correctly retrieve the component based on the formatType

  if (!ContentModule) {
    console.warn(
      `No module component found for type: ${moduleType}`,
    );
    return () => null;
  }

  return ContentModule;
};
