import { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { cubicBezier, useMotionValueEvent, useTransform } from "motion/react";

import { setFlyTo } from "../../../../../reducers/fly-to";

import { useStory } from "../../../../../providers/story/use-story";
import { useStoryScroll } from "../../../../../hooks/use-story-scroll";

import { Location } from "../../../../../types/story";

const GlobeScroll: FunctionComponent = () => {
  const { story } = useStory();
  const dispatch = useDispatch();

  const { scrollYProgress } = useStoryScroll({});
  const modules = story?.modules ?? [];

  const numberOfModules = Number(modules?.length);

  // generate array with equal spacing for all modules, starting at 0 (splashscreen) and ending at 1 (last module) before closing screen
  // as for now the structure is simple because all modules consist of exactly one slide. We might have to adapt this when we have more complex
  // modules
  const progressSteps = [
    0,
    ...Array.from({ length: numberOfModules }, (_, i) =>
      Number(((i + 1) / (numberOfModules + 1)).toFixed(5)),
    ),
  ];

  const location = story?.splashscreen?.location;

  // Default location values to ensure useTransform always has valid data
  const defaultLocation: Location = {
    lat: 0,
    lng: 0,
    altitude: 5000000,
  };

  // Validate that location has all required properties, otherwise use defaults
  const validLocation: Location = {
    lat: location?.lat ?? defaultLocation.lat,
    lng: location?.lng ?? defaultLocation.lng,
    altitude: location?.altitude ?? defaultLocation.altitude,
  };

  // construct an object with lat, lng, altitude as key and their values as first item in an array
  const initialValue: Record<keyof Location, number[]> = {
    lat: [validLocation.lat],
    lng: [validLocation.lng],
    altitude: [validLocation.altitude],
  };

  // arrays are populated with location values specified in the story-eei.json
  const locationValues = modules.reduce((acc, currentValue) => {
    const globeValues = currentValue?.globe;

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
  const { altitude, lng, lat } = useTransform(
    scrollYProgress,
    progressSteps,
    locationValues,
    {
      ease: cubicBezier(0.17, 0.67, 0.83, 0.67),
    },
  );

  // Dispatch interpolated globe position to store
  // Todo: don't dispatch when values have not changed
  // Should we have a throttle?
  useMotionValueEvent(scrollYProgress, "change", () => {
    dispatch(
      setFlyTo({
        renderMode: "globe",
        lat: lat?.get(),
        lng: lng?.get(),
        altitude: altitude?.get(),
        zoom: 10,
        isAnimated: false,
      }),
    );
  });

  return null;
};

export default GlobeScroll;
