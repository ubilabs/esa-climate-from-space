import { useMotionValueEvent } from "motion/react";
import { useScrollModule } from "../../../../modules/base-scroll/use-scroll-module";
import { useDispatch } from "react-redux";
import { setGlobeSpinning } from "../../../../../../../../reducers/globe/spinning";
import { useEffect, useRef } from "react";
import { setSelectedLayerIds } from "../../../../../../../../reducers/layers";
import { Layers } from "../../../constants/globe";

const spinStart = 0.2;
const spinEnd = 0.8;

export default function GlobalFires() {
  const { scrollYProgress } = useScrollModule();
  const isSpinning = useRef(false);
  const hasSelectedLayer = useRef(false);
  const dispatch = useDispatch();

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

    const shouldSpin = progress >= spinStart && progress <= spinEnd;

    if (shouldSpin === isSpinning.current) return;

    isSpinning.current = shouldSpin;
    dispatch(setGlobeSpinning(shouldSpin));
  });

  useEffect(() => {
    const progress = scrollYProgress.get();

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
      dispatch(setGlobeSpinning(false));
      isSpinning.current = false;
      hasSelectedLayer.current = false;
    };
  }, [dispatch, scrollYProgress]);

  return null;
}
