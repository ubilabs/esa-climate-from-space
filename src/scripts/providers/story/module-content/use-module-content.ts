import { createContext, use } from "react";
import { Module } from "../../../types/story";

// update for more content types
export const StoryContentContext = createContext<{
  module: Module;
  storyId: string;
  getRefCallback: (index: number | string) => (node: HTMLElement | null) => void;
} | null>(null);

export const useModuleContent = () => {
  const context = use(StoryContentContext);
  if (!context) {
    throw new Error("useContent must be used within a FormatProvider");
  }
  return context;
};
