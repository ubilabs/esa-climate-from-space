import { useMotionValueEvent, useTransform } from "motion/react";
import { useScrollModule } from "../../../../modules/base-scroll/use-scroll-module";
import { useDispatch } from "react-redux";
import { setGlobeSpinning } from "../../../../../../../../reducers/globe/spinning";
import { useEffect, useRef } from "react";
import { setSelectedLayerIds } from "../../../../../../../../reducers/layers";
import { Layers } from "../../../constants/globe";
import type { NamingTheBeastConfig } from "../naming-the-beast";
import { setGlobeContainerOpacity } from "../../../../../../../../libs/globe-container";

export default function GlobalFires() {
  const { scrollYProgress, config } =
    useScrollModule<NamingTheBeastConfig>();
  const globeOpacity = useTransform(
    scrollYProgress,
    config.globeOpacity.input,
    config.globeOpacity.output,
  );
  const isSpinning = useRef(false);
  const hasSelectedLayer = useRef(false);
  const dispatch = useDispatch();

  useMotionValueEvent(globeOpacity, "change", setGlobeContainerOpacity);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const isInsideModule = progress > 0 && progress < 1;

    if (isInsideModule && !hasSelectedLayer.current) {
      hasSelectedLayer.current = true;
      dispatch(
        setSelectedLayerIds({
          layerId: Layers.XFIRES_GLOBAL_FIRES,
          isPrimary: true,
        }),
      );
    } else if (!isInsideModule) {
      hasSelectedLayer.current = false;
    }

    const shouldSpin =
      progress >= config.spinStart && progress <= config.spinEnd;

    if (shouldSpin === isSpinning.current) return;

    isSpinning.current = shouldSpin;
    dispatch(setGlobeSpinning(shouldSpin));
  });

  useEffect(() => {
    const progress = scrollYProgress.get();

    if (progress >= config.globeOpacity.input[0]) {
      setGlobeContainerOpacity(globeOpacity.get());
    }

    if (progress > 0 && progress < 1) {
      hasSelectedLayer.current = true;
      dispatch(
        setSelectedLayerIds({
          layerId: Layers.XFIRES_GLOBAL_FIRES,
          isPrimary: true,
        }),
      );
    }

    return () => {
      setGlobeContainerOpacity(1);
      dispatch(setGlobeSpinning(false));
      isSpinning.current = false;
      hasSelectedLayer.current = false;
    };
  }, [config, dispatch, globeOpacity, scrollYProgress]);

  return null;
}
