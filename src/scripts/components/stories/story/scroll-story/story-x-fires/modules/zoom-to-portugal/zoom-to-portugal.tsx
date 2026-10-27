import { useScrollModule } from "../../../modules/base-scroll/use-scroll-module";
import { useMotionValueEvent, useTransform } from "motion/react";
import { useDispatch } from "react-redux";
import { Layers } from "../../constants/globe";
import { setSelectedLayerIds } from "../../../../../../../reducers/layers";
import { useEffect, useRef } from "react";
import type { ZoomToPortugalAnimationConfig } from "./zoom-to-portugal-module";
import { setGlobeContainerOpacity } from "../../../../../../../libs/globe-container";

export default function ZoomToPortugal() {
  const { scrollYProgress, config } =
    useScrollModule<ZoomToPortugalAnimationConfig>();
  const globeOpacity = useTransform(
    scrollYProgress,
    config.globeOpacity.input,
    config.globeOpacity.output,
  );

  const dispatch = useDispatch();
  const selectedLayer = useRef<string | null>(null);

  useMotionValueEvent(globeOpacity, "change", setGlobeContainerOpacity);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const isInsideModule = progress > 0 && progress < 1;

    if (!isInsideModule) {
      selectedLayer.current = null;
      return;
    }

    if (Layers.XFIRES_PORTUGAL !== selectedLayer.current) {
      selectedLayer.current = Layers.XFIRES_PORTUGAL;
      dispatch(
        setSelectedLayerIds({
          layerId: Layers.XFIRES_PORTUGAL,
          isPrimary: true,
        }),
      );
    }
  });

  useEffect(() => {
    const progress = scrollYProgress.get();

    if (progress > 0) {
      setGlobeContainerOpacity(globeOpacity.get());
    }

    return () => {
      setGlobeContainerOpacity(1);
      selectedLayer.current = null;
    };
  }, [dispatch, globeOpacity, scrollYProgress, config.globeLayerThreshold]);

  return null;
}
