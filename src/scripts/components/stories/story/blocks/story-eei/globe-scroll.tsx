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

import {
  Location,
  ScrollGlobe,
  ScrollGlobeValues,
} from "../../../../../types/story";

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
// Get default lengthFactor from CSS variable
const getDefaultLengthFactor = (): number => {
  const rootStyles = getComputedStyle(document.documentElement);
  const defaultValue = rootStyles
    .getPropertyValue("--default-scroll-length-factor")
    .trim();
  return parseFloat(defaultValue) || 1;
};

interface Props {
  initialGlobeConfiguration: ScrollGlobe | undefined;
}

const GlobeScroll: FunctionComponent<Props> = ({
  initialGlobeConfiguration,
}) => {
  const { story } = useStory();
  const modules = story?.modules ?? [];
  const splashscreen = story?.splashscreen;

  const dispatch = useDispatch();

  const initialGlobe = initialGlobeConfiguration?.location;
  const initialContainerPosition = initialGlobeConfiguration?.containerPosition;

  const { scrollYProgress } = useStoryScroll({});

  const storySegments =
    modules && splashscreen ? [splashscreen, ...modules] : [];

  const defaultLengthFactor = getDefaultLengthFactor();

  // Get splashscreen lengthFactor with warning if missing
  const splashscreenLengthFactor = splashscreen?.lengthFactor;

  if (splashscreenLengthFactor === undefined) {
    console.warn(
      "lengthFactor is missing from splashscreen, using default:",
      defaultLengthFactor,
    );
  }

  // Calculate total length from all modules
  const totalLength =
    (splashscreenLengthFactor ?? defaultLengthFactor) +
    storySegments.reduce((sum, module, index) => {
      if (module.lengthFactor === undefined) {
        console.warn(
          `lengthFactor is missing from module at index ${index} (type: ${module.type}), using default:`,
          defaultLengthFactor,
        );
      }
      return sum + (module.lengthFactor ?? defaultLengthFactor);
    }, 0);

  // Generate progress steps based on cumulative lengthFactors
  // Each step represents the scroll progress at the START of each module
  let cumulativeLength = 0;
  const progressSteps = [
    0, // Start at 0
    quantize(
      (splashscreenLengthFactor ?? defaultLengthFactor) / totalLength,
      0.0001,
    ), // After splashscreen
    ...modules.map((module) => {
      cumulativeLength += module.lengthFactor ?? defaultLengthFactor;
      return quantize(
        ((splashscreenLengthFactor ?? defaultLengthFactor) + cumulativeLength) /
          totalLength,
        0.0001,
      );
    }),
  ];

  // construct an object with lat, lng, altitude, container x- and y, as key and their values as first item in an array
  const initialValue = (
    Object.entries({ ...initialGlobe, ...initialContainerPosition }) as Array<
      [keyof ScrollGlobeValues, ScrollGlobeValues[keyof ScrollGlobeValues]]
    >
  ).reduce<Partial<Record<keyof ScrollGlobeValues, number[]>>>(
    (acc, [key, value]) => {
      acc[key] = [value];
      return acc;
    },
    {},
  );

  console.log("🚀 ~ globe-scroll.tsx:98 → initialValue:", initialValue);
  // arrays are populated with globe values specified in the story-eei.json
  const locationValues = [...storySegments].reduce(
    (acc, module) => {
      if ("globe" in module) {
        const globeOrContainerValue = {
          ...module?.globe?.location,
          ...module?.globe?.containerPosition,
        };

        for (const [key, value] of Object.entries(acc)) {
          // if we haven't specified location for a slide, we assume the globe should stay in the current position
          const newValue =
            globeOrContainerValue && key in globeOrContainerValue
              ? globeOrContainerValue[key as keyof typeof globeOrContainerValue]
              : (value.at(-1) ?? 0);
          acc[key as keyof typeof acc] = [...value, newValue as number];
        }
      } else {
        console.warn(
          `globe prop in present in module type "${module.type}. passed to GlobeScroll is not compatible, returning initialValue`,
        );
      }
      return acc;
    },
    { ...initialValue },
  );
  console.log("🚀 ~ globe-scroll.tsx:111 → locationValues:", locationValues);

  // map location values to progress steps
  const { x, y, ...globeMotions } = useTransform(
    scrollYProgress,
    progressSteps,
    locationValues,
    {
      // ease the mixing between each value (from the motion docs)
      ease: cubicBezier(0.17, 0.67, 0.83, 0.67),
    },
  );

  const root = document.documentElement;

  useMotionValueEvent(scrollYProgress, "change", () => {
    if (x && y) {
      root.style.setProperty(
        "--globe-container-y",
        `${Number(y.get()) * -100}vh`,
      );
      root.style.setProperty(
        "--globe-container-x",
        `${Number(x.get()) * -100}vw`,
      );
    }
  });

  // Dispatch interpolated globe position to store
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
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
