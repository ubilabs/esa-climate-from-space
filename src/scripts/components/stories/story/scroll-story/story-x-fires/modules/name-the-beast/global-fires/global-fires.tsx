import { useMotionValueEvent } from "motion/react";
import { useScrollModule } from "../../../../modules/base-scroll/use-scroll-module";
import { useDispatch } from "react-redux";
import { setGlobeSpinning } from "../../../../../../../../reducers/globe/spinning";
import { useEffect, useRef } from "react";

const spinStart = 0.2;
const spinEnd = 0.8;

export default function GlobalFires() {
  const { scrollYProgress } = useScrollModule();
  const isSpinning = useRef(false);
  const dispatch = useDispatch();

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const shouldSpin = progress >= spinStart && progress <= spinEnd;

    if (shouldSpin === isSpinning.current) return;

    isSpinning.current = shouldSpin;
    dispatch(setGlobeSpinning(shouldSpin));
  });

  useEffect(() => {
    return () => {
      dispatch(setGlobeSpinning(false));
      isSpinning.current = false;
    };
  }, [dispatch]);

  return null;
}
