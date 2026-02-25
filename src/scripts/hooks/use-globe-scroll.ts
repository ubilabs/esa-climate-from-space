import { cubicBezier, useMotionValueEvent, useTransform } from "motion/react";
import { useDispatch } from "react-redux";
import { useStoryScroll } from "./use-story-scroll";
import { setFlyTo } from "../reducers/fly-to";
import { useStory } from "../providers/story/use-story";

export default function useGlobeScroll() {
  const { story } = useStory();

  const { scrollYProgress } = useStoryScroll({});

  // We take the total number of modules plus 1 (splash screen)
  const totalLength = Number(story?.modules?.length) + 1 || 0;

  const progressSteps = [
    0,
    ...Array.from({ length: totalLength - 1 }, (_, i) =>
      Number(((i + 1) / totalLength).toFixed(5)),
    ),
  ];

  const initalValue = Object.entries(
    story?.splashscreen?.location || [],
  ).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: [value],
    }),
    {},
  );

  const locationValues = story?.modules.reduce((acc, currentValue) => {
    const location = currentValue.globe?.location ?? {};

    for (const [key, value] of Object.entries(acc)) {
      // if we haven't specified location for a slide, we assume the globe should stay in the current position
      const newValue = key in location ? location[key] : value.at(-1);
      acc[key] = [...value, newValue];
    }

    return acc;
  }, initalValue);

  const dispatch = useDispatch();

  const { altitude, lng, lat } = useTransform(
    scrollYProgress,
    progressSteps,
    locationValues,
    {
      ease: cubicBezier(0.17, 0.67, 0.83, 0.67),
    },
  );

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    dispatch(
      setFlyTo({
        renderMode: "globe",
        lat: lat.get(),
        lng: lng.get(),
        altitude: altitude.get(),
        zoom: 10,
        isAnimated: false,
      }),
    );
  });
}
