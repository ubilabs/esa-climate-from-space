import { FunctionComponent } from "react";

import { useStory } from "../../../providers/story/use-story";

import { useAutoScrollInShowcase } from "../../../hooks/use-auto-scroll-in-showcase";
import { useSyncStoryUrl } from "../../../hooks/use-sync-story-url";
import { useLenisForStory } from "../../../hooks/use-lenis-for-story";

import { ModuleContentProvider } from "../../../providers/story/module-content/module-content-provider";
import { ClosingScreen } from "./blocks/closing-screen/closing-screen";
import { SplashScreen } from "./blocks/splashscreen/splashscreen";
import { getModuleComponent } from "../../../libs/get-story-components";

import cx from "classnames";

import styles from "./story.module.css";

/**
 * The Story component is responsible for rendering the story's content.
 * Each story is dynamically generated from a JSON file located in storage/stories/[story].
 * The hierarchical structure of a story is organized as follows: story > module > slides
 */
const Story: FunctionComponent = () => {
  const {
    storyElementRef,
    story,
    setScrollAnchorRefs,
    getScrollAnchorRefsMap,
  } = useStory();

  // Initialize Lenis for smooth scrolling behavior in the story
  useLenisForStory();

  // Handles automatic scrolling through the story in showcase mode
  // and manages navigation to the next story when the current one ends
  useAutoScrollInShowcase();

  // Synchronize the URL with the current story state
  useSyncStoryUrl();

  if (!story) {
    return null;
  }
  console.log("Scroll Anchor Refs Map:", getScrollAnchorRefsMap());
  return (
    <main
      className={cx(styles.story, styles.fadeIn)}
      ref={storyElementRef}
      id="story"
    >
      <SplashScreen
        getRefCallback={(index: number) => setScrollAnchorRefs(`0-${index}`)}
      />
      {story.modules.map(({ type }, moduleIndex) => {
        const ModuleComponent = getModuleComponent(type);
        const moduleData = story.modules[moduleIndex];

        /* Assign this to element's ref within modules that should serve as scroll anchors. For instance, in time- or wavelength modules, designate every "blendImage" as a scroll anchor. */
        const generateScrollAnchorRef = (nodeIndex: number | string) =>
          setScrollAnchorRefs(`${moduleIndex + 1}-${nodeIndex}`);

        return (
          <ModuleContentProvider
            key={moduleIndex}
            module={moduleData}
            storyId={story.id}
            getRefCallback={generateScrollAnchorRef}
          >
            <ModuleComponent />
          </ModuleContentProvider>
        );
      })}
      {/* Provisional - will be replaced with a proper end screen later */}
      <ClosingScreen />
    </main>
  );
};

export default Story;
