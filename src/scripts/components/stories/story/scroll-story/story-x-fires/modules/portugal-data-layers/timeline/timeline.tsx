import { FunctionComponent, useState } from "react";
import { useSelector } from "react-redux";
import { motion, useMotionValueEvent, useTransform } from "motion/react";

import { Language } from "../../../../../../../../types/language";
import { languageSelector } from "../../../../../../../../selectors/language";

import { useScrollModule } from "../../../../modules/base-scroll/use-scroll-module";
import { PortugalDataLayersAnimationConfig } from "../portugal-data-layers";

import styles from "./timeline.module.css";

const formatYearMonth = (date: Date, language: Language) => {
  const parts = new Intl.DateTimeFormat(language, {
    year: "numeric",
    month: "short",
  }).formatToParts(date);

  const year = parts.find(({ type }) => type === "year")?.value;
  const month = parts.find(({ type }) => type === "month")?.value;

  return `${year} ${month}`;
};

export const Timeline: FunctionComponent = () => {
  const lang = useSelector(languageSelector);

  const { scrollYProgress, config } =
    useScrollModule<PortugalDataLayersAnimationConfig>();

  const [showLabel, setShowLabel] = useState(false);
  const [dateTimeValue, setDateTimeValue] = useState("2017-01");

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    setShowLabel(
      current > config.timeline.visibilityThreshold &&
        current < config.outro.perspective[0],
    );
  });

  const month = useTransform(scrollYProgress, (progress) =>
    config.timeline.timeThresholds.findIndex(
      (threshold) => progress < threshold,
    ),
  );

  const label = useTransform(month, (month) =>
    formatYearMonth(new Date(2017, month), lang),
  );

  const dateTime = useTransform(
    month,
    (month) => `2017-${String(month + 1).padStart(2, "0")}`,
  );

  useMotionValueEvent(dateTime, "change", setDateTimeValue);

  return (
    <motion.time
      className={styles.label}
      dateTime={dateTimeValue}
      initial={{
        "--x-fires-timeline-opacity": 0,
      }}
      animate={{
        "--x-fires-timeline-opacity": showLabel ? 1 : 0,
      }}
      transition={{
        ease: "easeInOut",
        duration: showLabel ? 0.2 : 0.1,
      }}
    >
      {label}
    </motion.time>
  );
};
