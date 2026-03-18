import { useDeferredValue, useEffect, useState } from "react";
import { useScrollModule } from "../../base-scroll/use-scroll-module";
import { motion, useTransform } from "motion/react";
import ScrollText from "../../base-scroll/scroll-text/scroll-text";
import { KettleCountConfig } from "../kettle-count";
import { KettleIcon } from "../../../../../../../main/icons/kettle-icon";
import { useScreenInfo } from "../../../../../../../../hooks/use-screen-info";
import { useModuleContent } from "../../../../../../../../providers/story/module-content/use-module-content";
import { StoryEEIModule } from "../../../../../../../../types/story";

import styles from "./boil-count.module.css";

function formatNumber(value: number, isMobile: boolean): string {
  if (isMobile) {
    // Mobile: always abbreviate with billions
    const billions = value / 1_000_000_000;
    const formattedNumber = billions.toFixed(2);
    const withDots = formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${withDots}B`;
  }

  // Desktop: show full number until trillions
  if (value < 1_000_000_000_000) {
    // Below 1 trillion: show full number with dot separators
    return value.toLocaleString("de-DE"); // German locale uses dots as thousand separators
  } else {
    // 1 trillion and above: abbreviate with T suffix
    const trillions = value / 1_000_000_000_000;
    const formattedNumber = trillions.toFixed(3);
    const withDots = formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${withDots}T`;
  }
}

export default function BoilCount() {
  const KETTLES_PER_SECOND = 1137667304;
  const [value, setValue] = useState(0);
  // let react priorizite other UI updates
  const deferredCount = useDeferredValue(value);

  const { isMobile } = useScreenInfo();
  const { scrollYProgress, config } = useScrollModule<KettleCountConfig>();
  const { module } = useModuleContent();

  const eeiModule = module as StoryEEIModule;

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prevValue) => prevValue + KETTLES_PER_SECOND);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const y = useTransform(
    scrollYProgress,
    config.boilCount.input,
    config.boilCount.output,
  );

  if (!eeiModule.content) {
    console.warn("no content provided for ", module.type);
    return null;
  }

  return (
    <>
      <motion.div className={styles.countWrapper} style={{ y }}>
        <ScrollText text={eeiModule.content.boilText1 || ""}></ScrollText>
        <div className={styles.countContainer}>
          <span className={styles.count}>
            {formatNumber(deferredCount, isMobile)}
          </span>
          <span className={styles.text}>
            <KettleIcon />
            kettles of water
          </span>
        </div>
        <ScrollText
          inputRange={[1]}
          outputRange={[1]}
          text={eeiModule.content.boilText2 || ""}
        ></ScrollText>
      </motion.div>
    </>
  );
}
