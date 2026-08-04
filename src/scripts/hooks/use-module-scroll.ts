import { useStory } from "../providers/story/use-story";
import { useEffect, useEffectEvent, useState } from "react";
import { quantize } from "../libs/quantize";
import { useScreenInfo } from "./use-screen-info";

export function useModuleScroll() {
  const { getModuleRefsMap, story } = useStory();
  const [heightFractionPerModule, setHeightFractionPerModule] =
    useState<Array<number>>();

  const { screenWidth, screenHeight } = useScreenInfo();
  const onMount = useEffectEvent(() => {
    const nodes = getModuleRefsMap();

    const minScroll =
      Array.from(nodes.values()).at(0)?.getBoundingClientRect().y || 0;

    // get scroll height
    const maxScrollY =
      Array.from(nodes.values()).at(-1)?.getBoundingClientRect().y || 0;

    // The chapter indicator needs each module's relative position up front so its
    // dots and active ring stay aligned with the actual scroll path of the story.
    const scrollYPerModule = Array.from(nodes.values()).map((node) => {
      const heigth = quantize(
        (node.getBoundingClientRect().y - minScroll) / (maxScrollY - minScroll),
        0.0001,
      );

      return heigth;
    });

    setHeightFractionPerModule(scrollYPerModule);
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onMount();
  }, [story, screenWidth, screenHeight]);

  return {
    moduleLength: heightFractionPerModule?.length,
    heightFractionPerModule,
  };
}
