import { PropsWithChildren } from "react";
import { Module } from "../../../types/story";
import { StoryContentContext } from "./use-module-content";

interface ModuleContentProviderProps extends PropsWithChildren {
  module: Module;
  storyId: string;
  getRefCallback: (index: number) => (node: HTMLElement | null) => void;
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
