import { FunctionComponent } from "react";

import { useStory } from "../../../providers/story/use-story";

import { useAutoScrollInShowcase } from "../../../hooks/use-auto-scroll-in-showcase";
import { useSyncStoryUrl } from "../../../hooks/use-sync-story-url";

import { FormatProvider } from "../../../providers/story/format/format-provider";

import { SplashScreen } from "./blocks/splashscreen/splashscreen";
import {
  getBlockComponent,
  getFormatComponent,
} from "../../../libs/get-story-components";

import cx from "classnames";

import styles from "./story.module.css";

/**
 * The Story component is responsible for rendering the story's content.
 * Each story is dynamically generated from a JSON file located in storage/stories/[story].
 * The hierarchical structure of a story is organized as follows: story > block > module.
 */
const Story: FunctionComponent = () => {
  // use the StoryProvider to access the story data
  const { storyElementRef, story, setScrollableFormatRefs } = useStory();

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
        <SplashScreen ref={setScrollableFormatRefs("0-0-0")} />
      )}
      {story.content.map((contentBlock, idx) => {
        const BlockComponent = getBlockComponent(contentBlock.type);

        const blockIndex = idx + 1;

        return (
          <BlockComponent key={idx}>
            {contentBlock.blocks.map(({ type }, i) => {
              const FormatComponent = getFormatComponent(type);
              const formatData = contentBlock.blocks[i];

              const createRefCallbackForBlock = (index: number) =>
                setScrollableFormatRefs(`${blockIndex}-${i}-${index}`);

              return (
                <FormatProvider key={i} content={formatData} storyId={story.id}>
                  <FormatComponent
                    ref={setScrollableFormatRefs(`${blockIndex}-${i}`)}
                    // should be passed via FormatProvider
                    getRefCallback={createRefCallbackForBlock}
                  />
                </FormatProvider>
              );
            })}
          </BlockComponent>
        );
      })}
    </main>
  );
};

export default Story;
