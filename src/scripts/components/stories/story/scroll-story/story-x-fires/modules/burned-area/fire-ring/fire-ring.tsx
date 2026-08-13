import { FunctionComponent, useEffect, useState } from "react";
import {
  animate,
  motion,
  MotionConfig,
  useMotionValue,
  useMotionValueEvent,
} from "motion/react";

import { StoryXFiresModule } from "../../../../../../../../types/story";
import { useModuleContent } from "../../../../../../../../providers/story/module-content/use-module-content";
import { useScreenInfo } from "../../../../../../../../hooks/use-screen-info";

import { useScrollModule } from "../../../../modules/base-scroll/use-scroll-module";
import { BurnedAreaAnimationConfig } from "../burned-area";

import styles from "./fire-ring.module.css";

const BURNED_AREA_LEGEND_PATH_END = { x: 60, y: 57.5 };
const BURNED_AREA_EXPANDED_LEGEND_PATH_END = { x: 85.5, y: 27.2 };
const BURNED_AREA_MIN_SIZE = 20;
const BURNED_AREA_MAX_SIZE = 125;

const transitionConfig = {
  fadeIn: {
    ease: "easeInOut" as const,
    duration: 1.5,
  },
  fadeOut: {
    ease: "easeInOut" as const,
    duration: 0.5,
    delay: 0.2,
  },
  expansion: {
    ease: [0.34, 0.8, 0.1, 1] as const,
    duration: 1,
  },
};

export const FireRing: FunctionComponent = () => {
  const { isMobile } = useScreenInfo();

  const { module } = useModuleContent();
  const xFiresModule = module as StoryXFiresModule;

  const { scrollYProgress, config } =
    useScrollModule<BurnedAreaAnimationConfig>();
  const [isBurnedAreaVisible, setIsBurnedAreaVisible] = useState(false);
  const [isBurnedAreaExpanded, setIsBurnedAreaExpanded] = useState(false);

  const burnedAreaSize = useMotionValue(BURNED_AREA_MIN_SIZE);
  const [burnedAreaValue, setBurnedAreaValue] = useState(BURNED_AREA_MIN_SIZE);

  // Animate burned area size value based on flame expansion state
  useEffect(() => {
    const controls = animate(
      burnedAreaSize,
      isBurnedAreaExpanded ? BURNED_AREA_MAX_SIZE : BURNED_AREA_MIN_SIZE,
      transitionConfig.expansion,
    );

    return () => controls.stop();
  }, [burnedAreaSize, isBurnedAreaExpanded]);

  // Counter for burned area size value
  useMotionValueEvent(burnedAreaSize, "change", (latest) => {
    setBurnedAreaValue(Math.round(latest));
  });

  // Control fire ring visibility and expansion based on scroll progress
  useMotionValueEvent(scrollYProgress, "change", (current) => {
    setIsBurnedAreaVisible(current >= config.burnedArea.visibleThreshold);
    setIsBurnedAreaExpanded(current >= config.burnedArea.expandedThreshold);
  });

  const displacementScale = useMotionValue(30);
  const filterOffset = useMotionValue(-4.5);

  // Handle filter animations when visibility changes
  useEffect(() => {
    const displacementFactor = isBurnedAreaVisible ? 1 : 3;
    const transition = isBurnedAreaVisible
      ? transitionConfig.fadeIn
      : transitionConfig.fadeOut;

    const displacementScaleControls = animate(
      displacementScale,
      displacementFactor * 10,
      transition,
    );
    const filterOffsetControls = animate(
      filterOffset,
      displacementFactor * -1.5,
      transition,
    );

    return () => {
      displacementScaleControls.stop();
      filterOffsetControls.stop();
    };
  }, [displacementScale, filterOffset, isBurnedAreaVisible]);

  return (
    <div className={styles.container}>
      <figure>
        <MotionConfig transition={transitionConfig.expansion}>
          <svg
            viewBox="0 0 120 140"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
          >
            <title>{xFiresModule.content?.fireRingIllustrationTitle}</title>
            <desc>{xFiresModule.content?.fireRingIllustrationDescription}</desc>

            <defs>
              <filter
                id="fire-ring-glow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <motion.feGaussianBlur
                  stdDeviation={4}
                  animate={{ stdDeviation: [4, 6, 4] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </filter>

              <filter
                id="fire-ring-displacement-filter"
                x="-150%"
                y="-150%"
                width="400%"
                height="400%"
              >
                <motion.feTurbulence
                  type="fractalNoise"
                  numOctaves={1}
                  result="fineNoise"
                  baseFrequency={0.6}
                  animate={{ baseFrequency: [0.6, 0.4, 0.6] }}
                  transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.feTurbulence
                  type="turbulence"
                  numOctaves={4}
                  result="largeNoise"
                  baseFrequency={0.05}
                  animate={{ baseFrequency: [0.05, 0.08, 0.05] }}
                  transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <feBlend
                  in="fineNoise"
                  in2="largeNoise"
                  mode="multiply"
                  result="combinedNoise"
                />
                <motion.feDisplacementMap
                  in="SourceGraphic"
                  in2="combinedNoise"
                  result="displacement"
                  scale={displacementScale}
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
                <motion.feOffset
                  in="displacement"
                  dx={filterOffset}
                  dy={filterOffset}
                />
              </filter>

              <radialGradient id="fire-ring-fill-gradient" cx="50%" cy="50%">
                <stop offset="20%" stopColor="#9601360a" />
                <stop offset="70%" stopColor="#cf1d3933" />
                <stop offset="100%" stopColor="#fbab1833" />
              </radialGradient>

              <radialGradient id="fire-ring-stroke-gradient" cx="50%" cy="50%">
                <stop offset="99%" stopColor="#F47920" />
                <stop offset="100%" stopColor="#FBAB18" />
              </radialGradient>
            </defs>

            {/* Burned area */}
            <motion.g
              style={{ originX: 0.5, originY: 0.5 }}
              initial={{ scale: 0.25 }}
              animate={{ scale: isBurnedAreaExpanded ? 1 : 0.25 }}
            >
              <motion.circle
                cx="60"
                cy="70"
                fill="none"
                filter="url(#fire-ring-glow)"
                stroke="#FBAB18"
                initial={{ r: 0, strokeWidth: 4 }}
                animate={{
                  r: isBurnedAreaVisible ? 51 : 0,
                  strokeWidth: isBurnedAreaExpanded ? 2 : 4,
                }}
                transition={{
                  default: transitionConfig.expansion,
                  r: isBurnedAreaVisible
                    ? transitionConfig.fadeIn
                    : transitionConfig.fadeOut,
                }}
              />
              <motion.circle
                cx="60"
                cy="70"
                filter="url(#fire-ring-displacement-filter)"
                fill="url(#fire-ring-fill-gradient)"
                stroke="url(#fire-ring-stroke-gradient)"
                initial={{ r: 0, strokeWidth: 6 }}
                animate={{
                  r: isBurnedAreaVisible ? 50 : 0,
                  strokeWidth: isBurnedAreaExpanded ? 3 : 6,
                }}
                transition={{
                  default: transitionConfig.expansion,
                  r: isBurnedAreaVisible
                    ? transitionConfig.fadeIn
                    : transitionConfig.fadeOut,
                }}
              />
            </motion.g>

            {/* Path to burned area legend */}
            <motion.path
              fill="none"
              stroke="#FBAB18"
              strokeWidth="0.5"
              strokeDasharray={100}
              initial={{
                d: `M${BURNED_AREA_LEGEND_PATH_END.x} ${BURNED_AREA_LEGEND_PATH_END.y}L100 10L100 5`,
                strokeDashoffset: 100,
              }}
              animate={{
                d: isBurnedAreaExpanded
                  ? `M${BURNED_AREA_EXPANDED_LEGEND_PATH_END.x} ${BURNED_AREA_EXPANDED_LEGEND_PATH_END.y}L100 10L100 5`
                  : `M${BURNED_AREA_LEGEND_PATH_END.x} ${BURNED_AREA_LEGEND_PATH_END.y}L100 10L100 5`,
                strokeDashoffset: isBurnedAreaVisible ? 0 : 100,
              }}
              transition={{
                default: transitionConfig.expansion,
                strokeDashoffset: {
                  ease: "easeInOut",
                  duration: 0.2,
                  delay: isBurnedAreaVisible
                    ? transitionConfig.fadeIn.duration + 0.15
                    : 0,
                },
              }}
            />
            <motion.circle
              r="1"
              fill="#FBAB18"
              initial={{
                cx: BURNED_AREA_LEGEND_PATH_END.x,
                cy: BURNED_AREA_LEGEND_PATH_END.y,
                scale: 0,
              }}
              animate={{
                cx: isBurnedAreaExpanded
                  ? BURNED_AREA_EXPANDED_LEGEND_PATH_END.x
                  : BURNED_AREA_LEGEND_PATH_END.x,
                cy: isBurnedAreaExpanded
                  ? BURNED_AREA_EXPANDED_LEGEND_PATH_END.y
                  : BURNED_AREA_LEGEND_PATH_END.y,
                scale: isBurnedAreaVisible ? 1 : 0,
              }}
              transition={{
                default: transitionConfig.expansion,
                scale: {
                  ease: "easeInOut",
                  duration: 0.15,
                  delay: isBurnedAreaVisible
                    ? transitionConfig.fadeIn.duration
                    : 0,
                },
              }}
            />

            {/* Ground area */}
            <circle
              cx="60"
              cy="70"
              r="24"
              fill="none"
              stroke="#ED1B2F"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="0.5"
              strokeDasharray="1 2"
            />

            {/* Path to ground area legend */}
            <path
              d={`M60 94L${isMobile ? 39 : 29} 130L${isMobile ? 39 : 29} 135`}
              fill="none"
              stroke="#ED1B2F"
              strokeWidth="0.5"
            />
            <circle cx="60" cy="94" r="1" fill="#ED1B2F" />
          </svg>
        </MotionConfig>

        <figcaption>
          <ul className={styles.legend} aria-label="Legend">
            <motion.li
              className={styles.burnedArea}
              initial={{ opacity: 0 }}
              animate={{ opacity: isBurnedAreaVisible ? 1 : 0 }}
              transition={{
                ease: "easeInOut",
                duration: 0.3,
                delay: isBurnedAreaVisible
                  ? transitionConfig.fadeIn.duration + 0.35
                  : 0,
              }}
            >
              <span className={styles.value}>{burnedAreaValue}&nbsp;km²</span>
            </motion.li>
            <li className={styles.groundArea}>
              {xFiresModule.content?.legendLabelBurnedAreaThreshold}
            </li>
          </ul>
        </figcaption>
      </figure>
    </div>
  );
};
