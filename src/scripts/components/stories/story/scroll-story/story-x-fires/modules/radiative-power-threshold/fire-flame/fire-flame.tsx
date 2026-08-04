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

import { useScrollModule } from "../../../../modules/base-scroll/use-scroll-module";
import { RadiativePowerThresholdAnimationConfig } from "../radiative-power-threshold";

import styles from "./fire-flame.module.css";

const FLAME_PATHS = {
  outer: [
    "M34.7126 39.1429C34.664 43.3341 33.2626 55.0142 40.132 57.0071C43.3935 57.9533 47.0014 52.25 43.7169 46.25C40.4323 40.25 40.8641 35.4677 46.0051 28.855C51.8781 20.46 55.5521 11.9849 47.0014 5C61.3351 8.82231 66.3165 19.5682 68.5167 34.4091C70.7169 49.25 76.7169 57.0071 80.746 56.0742C84.7752 55.1412 84.7453 46.5216 84.2414 41.4454C114.217 74.75 99.9669 124.967 61.3127 124.967C22.6584 124.967 3.217 85.2501 34.7126 39.1429Z",
    "M26.4671 68C26.4185 72.1912 32.4671 88.2501 39.2171 88.2501C45.9671 88.2501 50.4671 80 42.9671 68C35.4671 56 43.8261 41.6128 48.9671 35C54.8401 26.605 57.0522 11.9849 48.5015 5C62.8352 8.82231 73.7669 17.1591 75.9671 32C78.1672 46.8409 63.2171 60.5 68.4671 70.25C73.7171 80 84.9671 69.5 78.967 50C107.467 80 101.467 124.967 62.8127 124.967C24.1585 124.967 15.2171 92.7501 26.4671 68Z",
  ],
  inner: [
    "M40.1399 105.571C40.1399 96.0321 46.7037 90.7695 46.7037 90.7695C46 100.25 54.3081 98 53.5 94.25C52.75 90.7695 52.75 89 57.25 84.5C62.1394 79.6106 62.4519 72.1 59.4766 66.2422C67 73.25 66.6667 84.7695 65.9167 90.7695C64.3684 103.156 76.75 101 78.2802 91.1226C82.8298 105.321 75.0188 123.785 58.6915 124.965C50.2406 125.575 40.1399 117.907 40.1399 105.571Z",
    "M41.1332 105.571C41.1332 96.0321 43 94.25 43.9932 92C46.75 104 54.25 108.5 56.7432 100.25C57.5206 97.6775 58 92.75 58 89C58 84.3615 58 80 56.7432 76.25C65.7432 81.5 66.4154 96.5616 69.8293 99.1558C73.2432 101.75 74.8651 98.3737 76.2431 94.25C80.3237 106.984 74.382 123.903 59.6848 124.965C51.2338 125.575 41.1332 117.907 41.1332 105.571Z",
  ],
};

const FIRE_EVENT_MIN_MW = 20;
const FIRE_EVENT_MAX_MW = 125;

const transitionConfig = {
  ease: [0.34, 0.8, 0.1, 1] as const,
  duration: 0.8,
};

export const FireFlame: FunctionComponent = () => {
  const { module } = useModuleContent();
  const xFiresModule = module as StoryXFiresModule;

  const { scrollYProgress, config } =
    useScrollModule<RadiativePowerThresholdAnimationConfig>();
  const [isFlameExpanded, setIsFlameExpanded] = useState(false);

  const fireEventMW = useMotionValue(FIRE_EVENT_MIN_MW);
  const [fireEventValue, setFireEventValue] = useState(FIRE_EVENT_MIN_MW);

  // Animate fire event MW value based on flame expansion state
  useEffect(() => {
    const controls = animate(
      fireEventMW,
      isFlameExpanded ? FIRE_EVENT_MAX_MW : FIRE_EVENT_MIN_MW,
      transitionConfig,
    );

    return () => controls.stop();
  }, [fireEventMW, isFlameExpanded]);

  // Counter for fire event MW value
  useMotionValueEvent(fireEventMW, "change", (latest) => {
    setFireEventValue(Math.round(latest));
  });

  // Toggle flame expansion based on scroll progress
  useMotionValueEvent(scrollYProgress, "change", (current) => {
    setIsFlameExpanded(current > config.flame.expandedThreshold);
  });

  return (
    <MotionConfig transition={transitionConfig}>
      <div className={styles.container}>
        <figure>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 120 140"
            role="img"
          >
            <title>{xFiresModule.content?.flameIllustrationTitle}</title>
            <desc>{xFiresModule.content?.flameIllustrationDescription}</desc>

            <defs>
              <linearGradient
                id="fire-flame-outer-gradient"
                x1="65.8807"
                y1="5.00665"
                x2="65.8807"
                y2="125.043"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FDC654" />
                <stop offset="1" stopColor="#E61B2F" />
              </linearGradient>

              <linearGradient
                id="fire-flame-inner-gradient"
                x1="60.8741"
                y1="66.2422"
                x2="60.8741"
                y2="124.999"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FDC654" />
                <stop offset="1" stopColor="#EF6E2D" />
              </linearGradient>
            </defs>

            {/* Fire event */}
            <motion.g
              style={{ originX: 0.5, originY: 1 }}
              initial={{ scale: 0.12 }}
              animate={{ scale: isFlameExpanded ? 1 : 0.12 }}
            >
              <motion.path
                fill="url(#fire-flame-outer-gradient)"
                initial={{ d: FLAME_PATHS.outer[0] }}
                animate={{
                  d: [
                    ...FLAME_PATHS.outer,
                    ...FLAME_PATHS.outer.reverse().slice(1),
                  ],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.path
                fill="url(#fire-flame-inner-gradient)"
                initial={{ d: FLAME_PATHS.inner[0] }}
                animate={{
                  d: [
                    ...FLAME_PATHS.inner,
                    ...FLAME_PATHS.inner.reverse().slice(1),
                  ],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.g>

            {/* Path to fire event legend */}
            <motion.g
              initial={{ y: 0 }}
              animate={{ y: isFlameExpanded ? -85 : 0 }}
            >
              <path
                d="M60 115L100 100L100 95"
                fill="none"
                stroke="#FFCC4E"
                strokeWidth="0.5"
              />
              <circle cx="60" cy="115" r="1" fill="#FFCC4E" />
            </motion.g>

            {/* Radiative power threshold */}
            <path
              d="M41.0187 101.349C41.8973 95.0463 44.9107 89.7135 48.2453 84.2957C48.2453 84.2957 48.2061 87.6686 48.6198 89.6253C48.9018 90.9642 49.4668 92.5798 50.8211 92.765C51.8542 92.9067 52.8123 92.0144 53.0757 91.0045C53.3392 89.9946 53.0692 88.9237 52.7078 87.9442C52.3463 86.9659 51.8891 86.0051 51.7639 84.969C51.5254 82.9906 52.5227 81.0851 53.6124 79.4183C54.7022 77.7514 55.9487 76.0933 56.3069 74.1345C56.7097 71.9251 55.8268 69.5272 54.086 68.1088C57.8212 69.1023 61.0481 71.8564 62.619 75.3906C63.552 77.4889 63.9123 79.7887 64.3119 82.0515C64.7103 84.3131 65.1719 86.6097 66.278 88.6219C67.1479 90.207 68.488 91.6113 70.1243 92.3227C71.4231 90.2822 72.0251 87.7939 71.7856 85.3873C75.2226 88.9509 77.6971 93.4372 78.8718 98.2482C80.3208 104.175 79.7264 110.71 76.5964 115.946C73.8388 120.56 66.8383 124.756 60.8879 124.984C54.9376 125.212 49.5637 122.957 45.8818 119.158C41.4542 114.59 40.1401 107.652 41.0187 101.349Z"
              fill="#ED1B2F"
              fillOpacity="0.2"
              stroke="#ED1B2F"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="0.5"
              strokeDasharray="1 2"
            />

            {/* Path to radiative power threshold legend */}
            <path
              d="M60 125L30 135L30 140"
              fill="none"
              stroke="#ED1B2F"
              strokeWidth="0.5"
            />
            <circle cx="60" cy="125" r="1" fill="#ED1B2F" />
          </svg>

          <figcaption>
            <ul className={styles.legend} aria-label="Legend">
              <motion.li
                className={styles.fireEvent}
                initial={{
                  bottom:
                    "calc(43 / var(--x-fires-flame-illustation-height) * 100%)",
                }}
                animate={{
                  bottom: isFlameExpanded
                    ? "calc(128 / var(--x-fires-flame-illustation-height) * 100%)"
                    : "calc(43 / var(--x-fires-flame-illustation-height) * 100%)",
                }}
              >
                <span className={styles.value}>{fireEventValue}&nbsp;MW</span>
                {xFiresModule.content?.legendLabelFireEvent}
              </motion.li>
              <li className={styles.radiativePowerThreshold}>
                <span className={styles.value}>50&nbsp;MW</span>
                {xFiresModule.content?.legendLabelRadiativePowerThreshold}
              </li>
            </ul>
          </figcaption>
        </figure>
      </div>
    </MotionConfig>
  );
};
