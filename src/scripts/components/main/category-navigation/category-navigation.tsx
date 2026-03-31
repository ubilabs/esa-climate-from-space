import { FunctionComponent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import cx from "classnames";
import { FormattedMessage } from "react-intl";
import { animate, motion, useMotionValue, useTransform } from "motion/react";

import { categoryTags } from "../../../config/main";
import { useNavGestures } from "../../../libs/use-nav-gestures";
import { useContentParams } from "../../../hooks/use-content-params";
import { useScreenInfo } from "../../../hooks/use-screen-info";
import { setSelectedContentAction } from "../../../reducers/content";

import styles from "./category-navigation.module.css";

const CategoryNavigation: FunctionComponent = () => {
  const { category } = useContentParams();

  const { isMobile } = useScreenInfo();
  const dispatch = useDispatch();

  const categoryIndex = category
    ? categoryTags.indexOf(category)
    : Math.round(categoryTags.length / 2);

  const [currentIndex, setCurrentIndex] = useState(
    categoryIndex !== -1 ? categoryIndex : 0,
  );

  // Custom hook to handle wheel and drag gestures for navigation
  useNavGestures(categoryTags.length, setCurrentIndex, "y", true);

  // Gap between category elements: line-height (1.375rem) + gap (1.5rem) = 2.875rem ≈ 46px at 16px base
  const ITEM_STEP_REM = isMobile ? 2.875 : 5.375;

  const input = Array.from({ length: categoryTags.length }).map(
    (_, index) => index,
  );

  const y = useMotionValue(currentIndex);
  const scale = useMotionValue(currentIndex);

  useEffect(() => {
    animate(y, currentIndex, { type: "spring", stiffness: 500, damping: 35 });
    animate(scale, currentIndex, {
      type: "tween",
      stiffness: 300,
      damping: 30,
    });

    dispatch(
      setSelectedContentAction({ category: categoryTags[currentIndex] }),
    );
  }, [currentIndex, y, scale, dispatch]);

  return (
    <nav className={styles.categoryNav}>
      <ul className={styles.list}>
        {categoryTags.map((category, index) => {
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
                // it is fine to use a motion hook here
                // eslint-disable-next-line react-hooks/rules-of-hooks
                scale: useTransform(scale, input, scaleOutput),
                // eslint-disable-next-line react-hooks/rules-of-hooks
                y: useTransform(y, input, output),
              }}
            >
              <Link
                to={categoryTags[currentIndex]}
                className={styles.categoryLink}
              >
                {<FormattedMessage id={`categories.${category}`} />}
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </nav>
  );
};

export default CategoryNavigation;
