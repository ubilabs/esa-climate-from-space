import { useEffect } from "react";
import { cubicBezier, useMotionValueEvent, useTransform } from "motion/react";
import { useDispatch } from "react-redux";
import { useStoryScroll } from "./use-story-scroll";
import { setFlyTo } from "../reducers/fly-to";

export default function useGlobeScroll() {
  const { scrollYProgress } = useStoryScroll({});

  const totalLength = 12;

  const normalizedSteps = [
    0,
    ...Array.from({ length: totalLength - 1 }, (_, i) =>
      Number(((i + 1) / (totalLength - 1)).toFixed(5)),
    ),
  ];

  const altitudes = {
    0: 22839999.9999918,
    1: 2079886.324157265,
    2: 2079886.324157265,
    3: 1079886.324157265,
    4: 79886,
    5: 79886,
    6: 1079886,
    7: 1079886,
    8: 2079886,
    9: 4079886,
    10: 4079886,
    11: 22839999,
  };

  const dispatch = useDispatch();
  // const yValues = Object.values(constructions);
  const altitudeValues = Object.values(altitudes);
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

  // const y = useTransform(scrollYProgress, normalizedSteps, yValues, {});
  const altitude = useTransform(
    scrollYProgress,
    normalizedSteps,
    altitudeValues,
    {
      ease: cubicBezier(0.17, 0.67, 0.83, 0.67),
    },
  );

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
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
