import { useScrollModule } from "../../../modules/base-scroll/use-scroll-module";
import { useMotionValueEvent } from "motion/react";
import { useDispatch } from "react-redux";
import { Layers } from "../../constants/globe";
import { setSelectedLayerIds } from "../../../../../../../reducers/layers";

export default function ZoomToPortugal() {
  const { scrollYProgress } = useScrollModule();

  const dispatch = useDispatch();

  useMotionValueEvent(scrollYProgress, "change", (e) => {
    if (e > 0.1) {
      dispatch(
        setSelectedLayerIds({
          layerId: Layers.XFIRES_EARTH_MASK,
          isPrimary: true,
        }),
      );
    }
  });
  return null;
}
