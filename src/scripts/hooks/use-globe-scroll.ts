import { useEffect } from "react";
import { cubicBezier, useMotionValueEvent, useTransform } from "motion/react";
import { useDispatch } from "react-redux";
import { useStoryScroll } from "./use-story-scroll";
import { setFlyTo } from "../reducers/fly-to";
import { useStory } from "../providers/story/use-story";

export default function useGlobeScroll() {
  const { story } = useStory();
  console.log("🚀 ~ use-globe-scroll.ts:[  → story:", story);

  const { scrollYProgress } = useStoryScroll({});

  // We take the total number of modules plus 1 (splash screen)
  const totalLength = Number(story?.modules?.length) + 1 || 0;

  const progressSteps = [
    0,
    ...Array.from({ length: totalLength - 1 }, (_, i) =>
      Number(((i + 1) / totalLength - 1).toFixed(5)),
    ),
  ];

  const initalValue = Object.entries(story?.splashscreen.location).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: [value],
    }),
    {},
  );

  const moduleValues = story?.modules.reduce(
    (acc, currentValue) => {
      // if we haven't specified location for a slide, we assume the globe should stay in the current position
      //
      if (
        !currentValue.globe?.flyTo.position ||
        !Object.values(currentValue.globe?.flyTo.position).length
      ) {
        const lastElement = acc.at(-1);
        // return [...acc, lastElement];
      } else {
        // return [...acc, currentValue.globe?.flyTo.position];
      }
    },
    { ...story?.splashscreen.location },
  );

  const positionValues = [...moduleValues];

  // const altitudes = {
  //   0: 2283 ]999.9999918,
  //   1: 2079886.324157265,
  //   2: 2079886.324157265,
  //   3: 1079886.324157265,
  //   4: 79886,
  //   5: 79886,
  //   6: 1079886,
  //   7: 1079886,
  //   8: 2079886,
  //   9: 4079886,
  //   10: 4079886,
  //   11: 22839999,
  // };

  const dispatch = useDispatch();
  // const yValues = Object.values(constructions);
  // const altitudeValues = Object.values(altitudes);
  // console.log("🚀 ~ eei-globe.tsx:57 → altitudeValues:", altitudeValues);
  //
  useEffect(() => {
    // const dataView = document.querySelector("#globeWrapper > div");
    // console.log("🚀 ~ eei-globe.tsx:65 → dataView:", dataView);
    // setTimeout(() => {
    //   if (dataView) {
    //     dataView.style.transform = "translateX(-200px)";
    //   }
    // }, 2000);
  }, []);

  console.log(
    "🚀 ~ use-globe-scroll.ts:77 → progressSteps:",
    progressSteps.length,
  );
  // const y = useTransform(scrollYProgress, normalizedSteps, yValues, {});
  const { altitude } = useTransform(
    scrollYProgress,
    progressSteps,
    positionValues,
    {
      ease: cubicBezier(0.17, 0.67, 0.83, 0.67),
    },
  );

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    console.log("🚀 ~ use-globe-scroll.ts:75 → altitude:", altitude);
    dispatch(
      setFlyTo({
        renderMode: "globe",
        lat: 53.54917458120199,
        lng: 10.051499257242103,
        altitude: altitude.get(),
        zoom: 10,
        isAnimated: false,
      }),
    );
    console.log("x changed to", latest);
  });
}
