import { useDeferredValue, useEffect, useState } from "react";
import { useScrollModule } from "../../base-scroll/use-scroll-module";
import { motion, useTransform } from "motion/react";
import ScrollText from "../../base-scroll/scroll-text/scroll-text";
import { KettleCountConfig } from "../kettle-count";
import { KettleIcon } from "../../../../../../../main/icons/kettle-icon";
import { useModuleContent } from "../../../../../../../../providers/story/module-content/use-module-content";
import { StoryEEIModule } from "../../../../../../../../types/story";

import styles from "./boil-count.module.css";

function formatNumber(value: number): string {
  // Show up to 12 digits without abbreviation (< 1 trillion)
  if (value < 1_000_000_000_000) {
    return value.toLocaleString("en-US");
  }

  // 1 trillion and above: abbreviate with T suffix
  const trillions = value / 1_000_000_000_000;

  // Calculate decimal places to show (9 for scientific accuracy)
  const decimals = 9;
  const formatted = trillions.toFixed(decimals);
  const [integer, decimal] = formatted.split(".");

  // Add commas to integer part only
  const integerWithCommas = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Return with standard decimal notation (no commas in decimal)
  return `${integerWithCommas}.${decimal}T`;
}

export default function BoilCount() {
  const KETTLES_PER_SECOND = 1137667304;
  const [value, setValue] = useState(0);
  // let react priorizite other UI updates
  const deferredCount = useDeferredValue(value);

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
          <span className={styles.count}>{formatNumber(deferredCount)}</span>
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
