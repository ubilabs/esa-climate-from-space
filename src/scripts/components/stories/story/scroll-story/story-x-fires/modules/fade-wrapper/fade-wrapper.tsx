import { PropsWithChildren } from "react";
import { motion, useTransform } from "motion/react";

import { useScrollModule } from "../../../modules/base-scroll/use-scroll-module";
import { MotionStyle } from "motion";

import cx from "classnames"

import styles from "./fade-wrapper.module.css"

type direction = "fadeIn" | "fadeOut";

interface FadeWrapperProps extends PropsWithChildren {
  direction: direction;
  input?: number[];
  output?: number[];
  className?: string;
}

const defaultInput = {
  fadeIn: [0, 0.65, 1],
  fadeOut: [0, 0.8, 0.9],
};

const defaultOutput: Record<direction, number[]> = {
  fadeIn: [0, 1, 1],
  fadeOut: [1, 1, 0],
};

export default function FadeWrapper({
  children,
  direction,
  input,
  output,
  className,
}: FadeWrapperProps) {
  const { scrollYProgress } = useScrollModule();
  const opacity = useTransform(
    scrollYProgress,
    input ?? defaultInput[direction],
    output ?? defaultOutput[direction],
  );

  return (
    <motion.div
      className={cx( styles.fadeWrapper, className)}
      style={{ "--fade-wrapper-opacity": opacity } as MotionStyle}
    >
      {children}
    </motion.div>
  );
}
