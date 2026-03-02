import { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import {
  cubicBezier,
  MotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";

import { quantize } from "../../../../../libs/quantize";
import { setFlyTo } from "../../../../../reducers/fly-to";

import { useStory } from "../../../../../providers/story/use-story";
import { useStoryScroll } from "../../../../../hooks/use-story-scroll";

import { Location } from "../../../../../types/story";

function haveMotionValuesChanges(
  values: Partial<Record<keyof Location, MotionValue<unknown> | undefined>>,
) {
  // approximate value to defined steps
  // this way we avoid sending updates although they are not visible
  // also avoids flickering
  const allowedStep = (prop: keyof Location) =>
    prop === "altitude" ? 10000 : 0.01;

  return Object.entries(values).find(
    ([key, value]) =>
      quantize(value.getPrevious(), allowedStep(key as keyof Location)) !==
      quantize(value.get(), allowedStep(key as keyof Location)),
  );
}

const GlobeScroll: FunctionComponent = () => {
  const { story } = useStory();
  const dispatch = useDispatch();
  const location = story?.splashscreen?.location;

  const { scrollYProgress } = useStoryScroll({});
  const modules = story?.modules ?? [];

  const numberOfModules = Number(modules?.length);

  // generate array with equal spacing for all modules, starting at 0 (splashscreen) and ending at 1 (last module) before closing screen
  // as for now the structure is simple because all modules consist of exactly one slide. We might have to adapt this when we have more complex
  // modules
  const progressSteps = [
    0,
    ...Array.from({ length: numberOfModules }, (_, i) =>
      quantize((i + 1) / (numberOfModules + 1), 0.0001),
    ),
  ];

  // construct an object with lat, lng, altitude as key and their values as first item in an array
  const initialValue = (
    Object.entries(location ?? {}) as Array<
      [keyof Location, Location[keyof Location]]
    >
  ).reduce<Partial<Record<keyof Location, number[]>>>((acc, [key, value]) => {
    acc[key] = [value];
    return acc;
  }, {});

  // arrays are populated with location values specified in the story-eei.json
  const locationValues = modules.reduce((acc, module) => {
    const globeValues = module?.globe;

    const location =
      globeValues && "location" in globeValues && globeValues?.location;

    for (const [key, value] of Object.entries(acc)) {
      // if we haven't specified location for a slide, we assume the globe should stay in the current position
      const newValue =
        location && key in location
          ? location[key as keyof Location]
          : (value.at(-1) ?? 0);
      acc[key as keyof typeof acc] = [...value, newValue];
    }
    return acc;
  }, initialValue);

  // map location values to progress steps
  const globeMotions = useTransform(
    scrollYProgress,
    progressSteps,
    locationValues,
    {
      // ease the mixing between each value (from the motion docs)
      ease: cubicBezier(0.17, 0.67, 0.83, 0.67),
    },
  );

  // Dispatch interpolated globe position to store
  useMotionValueEvent(scrollYProgress, "change", () => {
    if (haveMotionValuesChanges(globeMotions)) {
      dispatch(
        setFlyTo({
          lat: globeMotions.lat?.get(),
          lng: globeMotions.lng?.get(),
          altitude: globeMotions.altitude?.get(),
        }),
      );
    }
  });

  return null;
};

export default GlobeScroll;
