import { useStory } from "../providers/story/use-story";
import { useEffect, useEffectEvent, useState } from "react";
import { quantize } from "../libs/quantize";
import { getCssVarPx } from "../libs/get-css-var-in-px";

export function useModuleScroll() {
  const { getModuleRefsMap, story } = useStory();
  const [heightFractionPerModule, setHeightFractionPerModule] =
    useState<Array<number>>();

  const onMount = useEffectEvent(() => {
    const nodes = getModuleRefsMap();

    const headerHeight = getCssVarPx("--header-height");

    const minScroll =
      Array.from(nodes.values()).at(0)?.getBoundingClientRect().y || 0;

    // get scroll height
    const maxScrollY =
      Array.from(nodes.values()).at(-1)?.getBoundingClientRect().y || 0;

    const scrollYPerModule = Array.from(nodes.values()).map((node) => {
      const heigth = quantize(
        (node.getBoundingClientRect().y - minScroll) /
          (maxScrollY - headerHeight - minScroll),
        0.0001,
      );

      return heigth;
    });

    setHeightFractionPerModule(scrollYPerModule);
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onMount();
  }, [story]);

  return {
    moduleLength: heightFractionPerModule?.length,
    heightFractionPerModule,
  };
}
