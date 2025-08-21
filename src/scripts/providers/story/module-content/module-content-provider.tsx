import { PropsWithChildren } from "react";
import { Module } from "../../../types/story";
import { StoryContentContext } from "./use-module-content";

interface ModuleContentProviderProps extends PropsWithChildren {
  module: Module;
  storyId: string;
}

export const ModuleContentProvider = ({
  children,
  module,
  storyId,
}: ModuleContentProviderProps) => (
  <StoryContentContext value={{ module, storyId }}>
    {children}
  </StoryContentContext>
);
