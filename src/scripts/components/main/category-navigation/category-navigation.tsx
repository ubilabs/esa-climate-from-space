import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";

import { useSelector } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";

import { categoryTags } from "../../../config/main";

import { useNavGestures } from "../../../libs/use-nav-gestures";
import { useContentParams } from "../../../hooks/use-content-params";

import { useScreenInfo } from "../../../hooks/use-screen-info";
import {
  useGetLayerListQuery,
  useGetStoryListQuery,
} from "../../../services/api";

import cx from "classnames";

// interface Props {
// setFirstInteractionRegistered: React.Dispatch<React.SetStateAction<boolean>>;
// isMobile: boolean;
// width: number;
// setCategory: React.Dispatch<React.SetStateAction<string | null>>;
// setAnimationReady: React.Dispatch<React.SetStateAction<boolean>>;
// arcs: { [key: string]: number }[];
// height: number;
// }

import styles from "./category-navigation.module.css";
import { languageSelector } from "../../../selectors/language";
import { animate, motion, useMotionValue, useTransform } from "motion/react";

const CategoryNavigation: FunctionComponent = () => {
  const { category } = useContentParams();

  const language = useSelector(languageSelector);

  const [lastUserInteractionTime, setLastUserInteractionTime] = useState(
    Date.now,
  );

  const { data: stories } = useGetStoryListQuery(language);
  const { data: layers } = useGetLayerListQuery(language);

  const { isMobile } = useScreenInfo();
  // const appRoute = useSelector(appRouteSelector);

  // const contents = useMemo(
  //   () => [
  //     ...(stories?.filter(
  //       (story) => category && story.categories?.includes(category),
  //     ) ?? []),
  //     ...(layers?.filter(
  //       (layer) => category && layer.categories?.includes(category),
  //     ) ?? []),
  //   ],
  //   [stories, layers, category],
  // );
  //
  // console.log("🚀 ~ category-navigation.tsx:44 → contents:", contents);
  const uniqueCategories = useMemo(
    () => [
      ...new Set(
        [
          ...(stories?.flatMap(({ categories }) => categories) ?? []),
          ...(layers?.flatMap(({ categories }) => categories) ?? []),
        ].filter(Boolean),
      ),
    ],
    [stories, layers],
  );

  const categoryIndex = category
    ? categoryTags.indexOf(category)
    : Math.round(uniqueCategories.length / 2);

  const [currentIndex, setCurrentIndex] = useState(
    categoryIndex !== -1 ? categoryIndex : 0,
  );

  // Custom hook to handle wheel and drag gestures for navigation
  useNavGestures(
    uniqueCategories.length,
    setCurrentIndex,
    setLastUserInteractionTime,
    "y",
    true,
  );

  // Auto initialize auto-rotation on user inactivity
  // useAutoRotate({
  //   lastUserInteractionTime,
  //   setCurrentIndex,
  //   itemsLength: 9,
  // });
  //

  // Item step: line-height (1.375rem) + gap (1.5rem) = 2.875rem ≈ 46px at 16px base
  const ITEM_STEP_REM = isMobile ? 2.875 : 5.375;

  const input = Array.from({ length: uniqueCategories.length }).map(
    (_, index) => index,
  );

  const y = useMotionValue(currentIndex);
  const scale = useMotionValue(currentIndex);

  useEffect(() => {
    animate(y, currentIndex, { type: "spring", stiffness: 500, damping: 35 });
    animate(scale, currentIndex, { type: "tween", stiffness: 300, damping: 30 });
  }, [currentIndex, y, scale]);

  return (
    <ul className={styles.categoryNavigation}>
      {uniqueCategories.map((category, index) => {
        const output = input.map(
          (entry) => `${(index - entry) * ITEM_STEP_REM}rem`,
        );

        const scaleFactor = isMobile ? 1.75 : 3.1;
        const scaleOutput = input.map((entry) =>
          entry === index ? scaleFactor : 1,
        );
        return (
          <motion.li
            key={category}
            className={cx(currentIndex === index && styles.selectedEntry)}
            initial={{
              top: "50%",
            }}
            style={{
              scale: useTransform(scale, input, scaleOutput),
              y: useTransform(y, input, output),
            }}
          >
            {<FormattedMessage id={`categories.${category}`} />}
          </motion.li>
        );
      })}
    </ul>
  );
};

export default CategoryNavigation;
