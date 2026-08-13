import { useScrollModule } from "../../../modules/base-scroll/use-scroll-module";
import { useMotionValueEvent } from "motion/react";
import { useDispatch } from "react-redux";
import { Layers } from "../../constants/globe";
import { setSelectedLayerIds } from "../../../../../../../reducers/layers";
import { useEffect, useRef } from "react";

export default function ZoomToPortugal() {
  const { scrollYProgress } = useScrollModule();

  const dispatch = useDispatch();
  const selectedLayer = useRef<string | null>(null);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const isInsideModule = progress > 0 && progress < 1;

    if (!isInsideModule) {
      selectedLayer.current = null;
      return;
    }

    const layerId =
      progress >= 0.5
        ? Layers.XFIRES_EARTH_MASK_PORTUGAL
        : Layers.XFIRES_EARTH_MASK;

    if (layerId !== selectedLayer.current) {
      selectedLayer.current = layerId;
      dispatch(
        setSelectedLayerIds({
          layerId,
          isPrimary: true,
        }),
      );
    }
  });

  useEffect(() => {
    const progress = scrollYProgress.get();

    if (progress > 0 && progress < 1) {
      const layerId =
        progress >= 0.5
          ? Layers.XFIRES_EARTH_MASK_PORTUGAL
          : Layers.XFIRES_EARTH_MASK;

      selectedLayer.current = layerId;
      dispatch(
        setSelectedLayerIds({
          layerId,
          isPrimary: true,
        }),
      );
    }

    return () => {
      selectedLayer.current = null;
    };
  }, [dispatch, scrollYProgress]);

  return null;
}
