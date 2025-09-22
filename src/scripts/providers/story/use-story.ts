import { createContext, use } from "react";
import { StoryContextValue } from "./story-provider";

export const StoryContext = createContext<StoryContextValue | undefined>(undefined);

export function useStory(): StoryContextValue {
  const context = use(StoryContext);
  if (!context) {
    throw new Error("useStory must be used within a StoryProvider");
  }
  return context;
}
