import { useScrollModule } from "../../../modules/base-scroll/use-scroll-module";
import { useMotionValueEvent } from "motion/react";
import { useDispatch } from "react-redux";
import { Layers } from "../../constants/globe";
import { setSelectedLayerIds } from "../../../../../../../reducers/layers";
import { useEffect, useRef } from "react";

export default function ZoomToPortugal() {
  const { scrollYProgress } = useScrollModule();

  const dispatch = useDispatch();
  const hasSelectedLayer = useRef(false);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const isInsideModule = progress > 0 && progress < 1;

    if (isInsideModule && !hasSelectedLayer.current) {
      hasSelectedLayer.current = true;
      dispatch(
        setSelectedLayerIds({
          layerId: Layers.XFIRES_EARTH_MASK,
          isPrimary: true,
        }),
      );
    } else if (!isInsideModule) {
      hasSelectedLayer.current = false;
    }
  });

  useEffect(() => {
    const progress = scrollYProgress.get();

    if (progress > 0 && progress < 1) {
      hasSelectedLayer.current = true;
      dispatch(
        setSelectedLayerIds({
          layerId: Layers.XFIRES_EARTH_MASK,
          isPrimary: true,
        }),
      );
    }

    return () => {
      hasSelectedLayer.current = false;
    };
  }, [dispatch, scrollYProgress]);

  return null;
}
