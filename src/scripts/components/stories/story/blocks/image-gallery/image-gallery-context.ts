import { createContext, useContext } from "react";

export enum GalleryFormats {
  Compare = "compare",
  Blend = "blend",
  Scroll = "scroll",
}

interface ImageGalleryContextType {
  mode: GalleryFormats;
  setMode: (mode: GalleryFormats) => void;
}

export const ImageGalleryContext =
  createContext<ImageGalleryContextType | null>(null);

export function useImageGalleryContext() {
  const ctx = useContext(ImageGalleryContext);
  if (!ctx) {
    throw new Error(
      "useImageGalleryContext must be used within ImageGallery.Provider",
    );
  }
  return ctx;
}
