import {
  FunctionComponent,
  useEffect,
} from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { animate, motion, useMotionValue, useTransform } from "motion/react";

import { categoryTags } from "../../../config/main";
import { useContentParams } from "../../../hooks/use-content-params";
import { useScreenInfo } from "../../../hooks/use-screen-info";
import { useNavigationControls } from "../../../hooks/use-navigation-controls";
import { setSelectedContentAction } from "../../../reducers/content";

import styles from "./category-navigation.module.css";

interface CategoryNavItemProps {
  category: string;
  index: number;
  positionValue: ReturnType<typeof useMotionValue<number>>;
  scaleValue: ReturnType<typeof useMotionValue<number>>;
  itemStepRem: number;
  scaleFactor: number;
  isActive: boolean;
  isMobile: boolean;
  selectedLinkRef?: React.RefObject<HTMLAnchorElement | null>;
}

const CategoryNavItem: FunctionComponent<CategoryNavItemProps> = ({
  category,
  index,
  positionValue,
  scaleValue,
  itemStepRem,
  scaleFactor,
  isActive,
  isMobile,
  selectedLinkRef,
}) => {
  const input = categoryTags.map((_, entry) => entry);
  const yOutput = input.map((entry) => `${(index - entry) * itemStepRem}rem`);
  const y = useTransform(positionValue, input, yOutput);

  const scale = useTransform(
    scaleValue,
    [index - 1, index, index + 1],
    [1, scaleFactor, 1],
  );
  const opacity = useTransform(scaleValue, [index - 1, index, index + 1], [0.8, 1, 0.8]);
  const x = useTransform(scaleValue, [index - 1, index, index + 1], [0, 10, 0]);
  const pointerEvents = useTransform(positionValue, (value) =>
    Math.round(value) === index ? "auto" : "none",
  );

  return (
    <motion.li
      data-index={index}
      initial={{
        top: "50%",
      }}
      style={{
        scale,
        y,
        pointerEvents: isMobile ? pointerEvents : "auto",
      }}
    >
      <Link
        ref={isActive ? selectedLinkRef : undefined}
        to={category}
        className={styles.categoryLink}
        tabIndex={isActive ? 0 : -1}
      >
        <motion.span style={{ opacity, x }}>
          <FormattedMessage id={`categories.${category}`} />
        </motion.span>
      </Link>
    </motion.li>
  );
};

const CategoryNavigation: FunctionComponent = () => {
  const { category } = useContentParams();

  const { isMobile } = useScreenInfo();
  const dispatch = useDispatch();

  const categoryIndex = category
    ? categoryTags.indexOf(category)
    : 0;

  const initialIndex = categoryIndex !== -1 ? categoryIndex : 0;

  // Gap between category elements: line-height (1.375rem) + gap (1.5rem) = 2.875rem ≈ 46px at 16px base
  const ITEM_STEP_REM = isMobile ? 2.875 : 5.375;

  const y = useMotionValue(initialIndex);
  const scale = useMotionValue(initialIndex);
  const scaleFactor = isMobile ? 1.75 : 3.1;
  const {
    currentIndex,
    previewIndex,
    listRef,
    selectedLinkRef,
    handleWheel: handleDesktopWheel,
    panHandlers,
  } = useNavigationControls({
    itemCount: categoryTags.length,
    initialIndex,
    isMobile,
    onSyncPreviewValue: (value) => {
      y.set(value);
      scale.set(value);
    },
    onAnimateToCurrentIndex: (nextIndex) => {
      const yAnimation = animate(y, nextIndex, {
        type: "tween",
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1],
      });
      const scaleAnimation = animate(scale, nextIndex, {
        type: "tween",
        duration: 0.18,
        ease: [0.22, 1, 0.36, 1],
      });

      return () => {
        yAnimation.stop();
        scaleAnimation.stop();
      };
    },
  });

  useEffect(() => {
    dispatch(
      setSelectedContentAction({ category: categoryTags[currentIndex] }),
    );
  }, [currentIndex, dispatch]);

  useEffect(() => {
    const nav = listRef.current?.closest("nav");

    if (!nav || isMobile) {
      return;
    }

    nav.addEventListener("wheel", handleDesktopWheel, { passive: false });

    return () => {
      nav.removeEventListener("wheel", handleDesktopWheel);
    };
  }, [handleDesktopWheel, isMobile, listRef]);

  return (
    <motion.nav
      className={styles.categoryNav}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 0.4, ease: "easeOut" },
      }}
      exit={{
        opacity: 0,
        transition: { duration: 0.2, ease: "easeIn" },
      }}
      onPanSessionStart={panHandlers.onPanSessionStart}
      onPan={panHandlers.onPan}
      onPanEnd={panHandlers.onPanEnd}
    >
      <ul ref={listRef} className={styles.list}>
        {categoryTags.map((cat, index) => (
          <CategoryNavItem
            key={cat}
            category={cat}
            index={index}
            positionValue={y}
            scaleValue={scale}
            itemStepRem={ITEM_STEP_REM}
            scaleFactor={scaleFactor}
            isActive={index === previewIndex}
            isMobile={isMobile}
            selectedLinkRef={selectedLinkRef}
          />
        ))}
      </ul>
    </motion.nav>
  );
};

export default CategoryNavigation;
