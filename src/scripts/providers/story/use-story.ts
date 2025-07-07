import { createContext, useContext } from "react";
import { StoryContextValue } from "./story-provider";

export const StoryContext = createContext<StoryContextValue | undefined>(undefined);

export function useStory(): StoryContextValue {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("useStory must be used within a StoryProvider");
  }
  return context;
}
