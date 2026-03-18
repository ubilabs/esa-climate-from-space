import { FunctionComponent, useEffect, useEffectEvent } from "react";
import { useDispatch } from "react-redux";
import {
  cubicBezier,
  MotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import { useScreenInfo } from "../../../../../hooks/use-screen-info";

import { quantize } from "../../../../../libs/quantize";
import { setFlyTo } from "../../../../../reducers/fly-to";

import { useStory } from "../../../../../providers/story/use-story";
import { useStoryScroll } from "../../../../../hooks/use-story-scroll";

import {
  GlobeKeyframe,
  Location,
  ScrollGlobeValues,
} from "../../../../../types/story";

import config from "../../../../../config/main";

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
  initialGlobeConfiguration: Omit<GlobeKeyframe, "progress"> | undefined;
}

const GlobeScroll: FunctionComponent<Props> = ({
  initialGlobeConfiguration,
}) => {
  const { isDesktop } = useScreenInfo();
  const { story } = useStory();
  const modules = story?.modules ?? [];
  const splashscreen = story?.splashscreen;

  const dispatch = useDispatch();

  const screenSizeSpecificInitialGlobe = isDesktop
    ? // Fallback to mobile configuration if desktop configuration is missing, otherwise use desktop configuration
      (initialGlobeConfiguration?.desktop ?? initialGlobeConfiguration?.mobile)
    : initialGlobeConfiguration?.mobile;

  const initialGlobe = screenSizeSpecificInitialGlobe?.location;
  const initialContainerPosition =
    screenSizeSpecificInitialGlobe?.containerPosition;

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
  const totalLength = storySegments.reduce((sum, module, index) => {
    if ("lengthFactor" in module && module.lengthFactor === undefined) {
      console.warn(
        `lengthFactor is missing from module at index ${index} (type: ${module.type}), using default:`,
        defaultLengthFactor,
      );
    }

    const lengthFactor =
      "lengthFactor" in module && typeof module.lengthFactor === "number"
        ? module.lengthFactor
        : defaultLengthFactor;

    return sum + lengthFactor;
  }, 0);

  // Generate progress steps based on cumulative lengthFactors
  // Each step represents the scroll progress at the START of each module
  let cumulativeLength = 0;

  const progressSteps = [
    0, // Start at 0
    ...storySegments.flatMap((module) => {
      const lengthFactor =
        "lengthFactor" in module && typeof module.lengthFactor === "number"
          ? module.lengthFactor
          : defaultLengthFactor;

      // we know the lengthFactor of the module, so we need to distribute it according to the keyFrame definition
      const keyframes: Array<GlobeKeyframe> =
        ("globeKeyframes" in module && module?.globeKeyframes) || [];

      const moduleStartLength = cumulativeLength;
      const distributedProgress: Array<number> = keyframes.map((frame) => {
        const absoluteProgress =
          moduleStartLength + lengthFactor * frame.progress;

        return quantize(absoluteProgress / totalLength, 0.0001);
      });

      // Update cumulative length after processing all keyframes in this module
      cumulativeLength += lengthFactor;

      return distributedProgress;
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

  // arrays are populated with globe values specified in the story-eei.json
  // Now considering globeKeyframes to match the progressSteps structure
  const locationValues = storySegments.reduce(
    (acc, module) => {
      // Get keyframes for this module
      const keyframes: Array<GlobeKeyframe> =
        ("globeKeyframes" in module && module?.globeKeyframes) || [];

      // For each keyframe, add its location and containerPosition values
      keyframes.forEach((frame) => {
        const screenSizeSpecificFrame = isDesktop
          ? // Fallback to mobile frame if desktop frame is missing and we're on desktop
            (frame.desktop ?? frame.mobile)
          : frame.mobile;

        const globeOrContainerValue = {
          ...screenSizeSpecificFrame.location,
          ...screenSizeSpecificFrame.containerPosition,
        };

        for (const [key, value] of Object.entries(acc)) {
          // Use the keyframe's value if available, otherwise keep the last value
          const newValue =
            key in globeOrContainerValue
              ? globeOrContainerValue[key as keyof typeof globeOrContainerValue]
              : (value.at(-1) ?? 0);
          acc[key as keyof typeof acc] = [...value, newValue as number];
        }
      });

      return acc;
    },
    { ...initialValue },
  );

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

  const updateGlobeContainerPosition = (x: number, y: number) => {
    root.style.setProperty("--globe-container-y", `${y * -100}vh`);
    root.style.setProperty("--globe-container-x", `${x * -100}vw`);
  };

  // Dispatch interpolated globe position to store
  const updateGlobePosition = () => {
    if (haveMotionValuesChanges(globeMotions)) {
      dispatch(
        setFlyTo({
          lat: globeMotions.lat?.get(),
          lng: globeMotions.lng?.get(),
          altitude: globeMotions.altitude?.get(),
        }),
      );
    }
  };

  const setInitialGlobePositions = useEffectEvent(() => {
    if (x && y) {
      updateGlobeContainerPosition(Number(x.get()), Number(y.get()));
    }
    updateGlobePosition();
  });

  const resetGlobePositions = useEffectEvent(() => {
    updateGlobeContainerPosition(0, 0);
    dispatch(setFlyTo(config.globe.view));
  });

  useEffect(() => {
    // Set initial globe position and container position on mount
    setInitialGlobePositions();

    // Reset globe position and container position on unmount
    return () => resetGlobePositions();
  }, []);

  useMotionValueEvent(scrollYProgress, "change", () => {
    if (x && y) {
      updateGlobeContainerPosition(Number(x.get()), Number(y.get()));
    }
    updateGlobePosition();
  });

  return null;
};

export default GlobeScroll;
