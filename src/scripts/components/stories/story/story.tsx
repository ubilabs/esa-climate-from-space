import { FunctionComponent, useCallback, useEffect } from "react";

import { useStory } from "../../../providers/story/use-story";
import { useDispatch } from "react-redux";

import { SyncStoryUrl } from "../../../hooks/use-sync-story-url";
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
  const { storyElementRef, story, getScrollableFormatsMap } = useStory();
  const dispatch = useDispatch();

  // Callback to get a reference to each scrollable format element
  const getRefCallback = useCallback(
    (key: string) => (node: HTMLElement | null) => {
      const map = getScrollableFormatsMap();
      if (node) {
        map.set(key, node);
      } else {
        map.delete(key);
      }
    },
    [getScrollableFormatsMap],
  );

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
      {story.splashscreen && <SplashScreen ref={getRefCallback("0-0")} />}
      {story.content.map((contentBlock, idx) => {
        const BlockComponent = getBlockComponent(contentBlock.type);
        const blockIndex = idx + 1;

        return (
          <BlockComponent key={idx}>
            {contentBlock.blocks.map(({ type }, i) => {
              const FormatComponent = getFormatComponent(type);
              const formatData = contentBlock.blocks[i];

              return (
                <FormatProvider key={i} content={formatData} storyId={story.id}>
                  <FormatComponent ref={getRefCallback(`${blockIndex}-${i}`)} />
                </FormatProvider>
              );
            })}
          </BlockComponent>
        );
      })}
      <SyncStoryUrl />
    </main>
  );
};

export default Story;
