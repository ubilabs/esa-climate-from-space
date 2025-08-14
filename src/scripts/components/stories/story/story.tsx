import { FunctionComponent, useCallback, useEffect, useState } from "react";

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
import { useAppRouteFlags } from "../../../hooks/use-app-route-flags";
import config from "../../../config/main";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrollElements(
  elements: Element[],
  abortSignal: { aborted: boolean },
) {
  for (const element of elements) {
    if (abortSignal.aborted) {
      break;
    }
    console.log("Scrolling to element:", element);
    element.scrollIntoView({ behavior: "smooth" });

    // wait 2s before scrolling the next one
    await delay(2000);
  }
}

// run it
const Story: FunctionComponent = () => {
  const { storyElementRef, story, getScrollableFormatsMap } = useStory();
  const dispatch = useDispatch();
  const { isShowCaseView, isPresentView } = useAppRouteFlags();
  const [elementCount, setElementCount] = useState(0);

  // const expectedElements = story
  //   ? (story.splashscreen ? 1 : 0) +
  //     story.content.reduce((acc, cb) => acc + cb.blocks.length, 0)
  //   : 0;

  // Callback to get a reference to each scrollable format element
  const getRefCallback = useCallback(
    (key: string) => (node: HTMLElement | null) => {
      const map = getScrollableFormatsMap();
      if (node) {
        map.set(key, node);
      } else {
        map.delete(key);
      }
      setElementCount(map.size);
    },
    [getScrollableFormatsMap],
  );

  useEffect(() => {
    if ((isShowCaseView || isPresentView) && elementCount > 0) {
      const elements = getScrollableFormatsMap();
      console.log("Scrollable elements count:", elements);
      const scrollableElements = Array.from(elements.values());
      const abortSignal = { aborted: false };

      scrollElements(scrollableElements, abortSignal);

      return () => {
        abortSignal.aborted = true;
      };
    }
  }, [isShowCaseView, isPresentView, elementCount, getScrollableFormatsMap]);

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

              const getRefCallbackForBlock = (index: number) =>
                getRefCallback(`${blockIndex}-${i}-${index}`);

              return (
                <FormatProvider key={i} content={formatData} storyId={story.id}>
                  <FormatComponent
                    ref={getRefCallback(`${blockIndex}-${i}`)}
                    getRefCallback={getRefCallbackForBlock}
                  />
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
