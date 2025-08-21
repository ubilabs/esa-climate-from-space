import { createContext, useContext } from "react";
import { Module } from "../../../types/story";

// update for more content types
export const StoryContentContext = createContext<{
  module: Module;
  storyId: string;
} | null>(null);

export const useModuleContent = () => {
  const context = useContext(StoryContentContext);
  if (!context) {
    throw new Error("useContent must be used within a FormatProvider");
  }
  return context;
};
