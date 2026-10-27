import { createContext, use } from "react";
import { GetRefCallback, Module } from "../../../types/story";

// update for more content types
export const StoryContentContext = createContext<{
  module: Module;
  storyId: string;
  getRefCallback: GetRefCallback;
} | null>(null);

export const useModuleContent = <T extends Module = Module>() => {
  const context = use(StoryContentContext);
  if (!context) {
    throw new Error("useContent must be used within a FormatProvider");
  }
  return context as Omit<typeof context, "module"> & { module: T };
};
