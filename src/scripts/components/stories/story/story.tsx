import { FunctionComponent } from "react";

import { useStory } from "../../../providers/story/use-story";

import { useAutoScrollInShowcase } from "../../../hooks/use-auto-scroll-in-showcase";
import { useSyncStoryUrl } from "../../../hooks/use-sync-story-url";

import { ModuleContentProvider } from "../../../providers/story/module-content/module-content-provider";
import { SplashScreen } from "./blocks/splashscreen/splashscreen";
import {
  getBlockComponent,
  getModuleComponent,
} from "../../../libs/get-story-components";

import cx from "classnames";

import styles from "./story.module.css";

/**
 * The Story component is responsible for rendering the story's content.
 * Each story is dynamically generated from a JSON file located in storage/stories/[story].
 * The hierarchical structure of a story is organized as follows: story > block > module > slides
 */
const Story: FunctionComponent = () => {
  const { storyElementRef, story, setScrollAnchorRefs } = useStory();

  // Handles automatic scrolling through the story in showcase mode
  // and manages navigation to the next story when the current one ends
  useAutoScrollInShowcase();
  useSyncStoryUrl();

  if (!story) {
    return null;
  }

  return (
    <main
      className={cx(styles.story, styles.fadeIn)}
      ref={storyElementRef}
      id="story"
    >
      {story.splashscreen && (
        <SplashScreen ref={setScrollAnchorRefs("0-0-0")} />
      )}
      {story.blocks.map((contentBlock, idx) => {
        const BlockComponent = getBlockComponent(contentBlock.type);

        const blockIndex = idx + 1;

        return (
          <BlockComponent key={idx}>
            {contentBlock.modules.map(({ type }, i) => {
              const ModuleComponent = getModuleComponent(type);
              const moduleData = contentBlock.modules[i];

              // Assign this to element's ref within modules that should serve as scroll anchors.
              // For instance, in time- or wavelength modules, designate every "blendImage" as a scroll anchor.
              const generateScrollAnchorRef = (index: number) =>
                setScrollAnchorRefs(`${blockIndex}-${i}-${index}`);

              return (
                <ModuleContentProvider
                  key={i}
                  module={moduleData}
                  storyId={story.id}
                  getRefCallback={generateScrollAnchorRef}
                >
                  <ModuleComponent />
                </ModuleContentProvider>
              );
            })}
          </BlockComponent>
        );
      })}
    </main>
  );
};

export default Story;
