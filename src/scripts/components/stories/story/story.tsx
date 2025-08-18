import { FunctionComponent, useCallback, useEffect, useState } from "react";

import { useStory } from "../../../providers/story/use-story";
import { useDispatch } from "react-redux";

import config from "../../../config/main";

import { useAppRouteFlags } from "../../../hooks/use-app-route-flags";

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
    element.scrollIntoView({ behavior: "smooth" });

    await delay(config.delay);
  }
}

// run it
const Story: FunctionComponent = () => {
  const {
    storyElementRef,
    story,
    getScrollableFormatsMap,
    setScrollableFormatRefs,
  } = useStory();
  const dispatch = useDispatch();
  const { isShowCaseView, isPresentView } = useAppRouteFlags();
  // const [elementCount, setElementCount] = useState(0);

  // const expectedElements = story
  //   ? (story.splashscreen ? 1 : 0) +
  //     story.content.reduce((acc, cb) => acc + cb.blocks.length, 0)
  //   : 0;

  // console.log("elementCount", getScrollableFormatsMap());
  // Callback to get a reference to each scrollable format element

  useEffect(() => {
    if (isShowCaseView || isPresentView) {
      setTimeout(() => {
        const elements = getScrollableFormatsMap();
        console.log("Scrollable elements count:", elements);
        const scrollableElements = Array.from(elements.values());
        const abortSignal = { aborted: false };

        scrollElements(scrollableElements, abortSignal);

        return () => {
          abortSignal.aborted = true;
        };
      }, 1000);
    }
  }, []);

  const elements = getScrollableFormatsMap();
  console.log("Scrollable elements count:", elements);
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
      <SyncStoryUrl />
    </main>
  );
};

export default Story;
