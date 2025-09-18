import { PropsWithChildren } from "react";
import { GetRefCallback, Module } from "../../../types/story";
import { StoryContentContext } from "./use-module-content";

interface ModuleContentProviderProps extends PropsWithChildren {
  module: Module;
  storyId: string;
  getRefCallback: GetRefCallback;
}

export const ModuleContentProvider = ({
  children,
  module,
  storyId,
  getRefCallback,
}: ModuleContentProviderProps) => (
  <StoryContentContext value={{ module, storyId, getRefCallback }}>
    {children}
  </StoryContentContext>
);
