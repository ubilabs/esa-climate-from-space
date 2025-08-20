import { createContext, useContext } from "react";
import { ImageGalleryFormat } from "../../../types/story";

// update for more content types
export const FormatContext = createContext<{
  content: ImageGalleryFormat;
  storyId: string;
} | null>(null);

export const useFormat = () => {
  const context = useContext(FormatContext);
  if (!context) {
    throw new Error("useFormat must be used within a FormatProvider");
  }
  return context;
};
