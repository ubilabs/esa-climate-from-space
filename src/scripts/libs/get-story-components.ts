import { FunctionComponent, ReactNode } from "react";
import {
  ImageGallery,
  ImageGalleryCompoundComponents,
} from "../components/stories/story/blocks/image-gallery/image-gallery";
import {
  ContentBlockType,
  ImageGalleryFormat,
  imageGalleryFormatMap,
  StorySectionProps,
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

// Map of block types to their respective format components
// Add missing format components here as needed
const formatMap: Record<
  ImageGalleryFormat["type"],
  FunctionComponent<StorySectionProps>
> = {
  ...imageGalleryFormatMap,
};

export const getBlockComponent = (contentBlockType: ContentBlockType) => {
  const BlockComponent = contentBlockMap[contentBlockType];

  if (!BlockComponent) {
    console.warn(
      `No component found for content block type: ${contentBlockType}`,
    );

    return () => null;
  }

  return BlockComponent;
};

export const getFormatComponent = (formatType: ImageGalleryFormat["type"]) => {
  const FormatComponent = formatMap[formatType]; // Correctly retrieve the component based on the formatType

  if (!FormatComponent) {
    console.warn(`No format component found for block type: ${formatType}`);
    return () => null;
  }

  return FormatComponent;
};
