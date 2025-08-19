import { FunctionComponent, useEffect } from "react";

import { useStory } from "../../../providers/story/use-story";
import { useDispatch } from "react-redux";

import { useAutoScrollInShowcase } from "../../../hooks/use-auto-scroll-in-showcase";
import { useSyncStoryUrl } from "../../../hooks/use-sync-story-url";

import { FormatProvider } from "../../../providers/story/format/format-provider";

import { setSelectedContentAction } from "../../../reducers/content";

import { SplashScreen } from "./blocks/splashscreen/splashscreen";
import {
  getBlockComponent,
  getFormatComponent,
} from "../../../libs/get-story-components";

import cx from "classnames";

import styles from "./story.module.css";

const Story: FunctionComponent = () => {
  const { storyElementRef, story, setScrollableFormatRefs } = useStory();
  const dispatch = useDispatch();

  useAutoScrollInShowcase();
  useSyncStoryUrl()

  useEffect(() => {
    if (!story?.id) {
      return;
    }

    dispatch(setSelectedContentAction({ contentId: story.id }));

    return () => {
      dispatch(setSelectedContentAction({ contentId: null }));
    };
  }, [dispatch, story?.id]);

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
