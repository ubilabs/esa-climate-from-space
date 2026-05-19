import {
  FunctionComponent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { animate, motion, useMotionValue, useTransform } from "motion/react";

import { categoryTags } from "../../../config/main";
import { useMobileMomentumNav } from "../../../libs/use-mobile-momentum-nav";
import { useContentParams } from "../../../hooks/use-content-params";
import { useScreenInfo } from "../../../hooks/use-screen-info";
import { useGlobalKeyboardNavigation } from "../../../hooks/use-global-keyboard-navigation";
import { useDesktopWheelNavigation } from "../../../hooks/use-desktop-wheel-navigation";
import { setSelectedContentAction } from "../../../reducers/content";

import styles from "./category-navigation.module.css";

const CATEGORY_NAV_INFINITE = false;

interface CategoryNavItemProps {
  category: string;
  index: number;
  positionValue: ReturnType<typeof useMotionValue<number>>;
  scaleValue: ReturnType<typeof useMotionValue<number>>;
  itemStepRem: number;
  scaleFactor: number;
  selectedLinkRef?: React.RefObject<HTMLAnchorElement | null>;
}

const CategoryNavItem: FunctionComponent<CategoryNavItemProps> = ({
  category,
  index,
  positionValue,
  scaleValue,
  itemStepRem,
  scaleFactor,
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

  return (
    <motion.li
      initial={{
        top: "50%",
      }}
      style={{ scale, y }}
    >
      <Link
        ref={selectedLinkRef}
        to={category}
        className={styles.categoryLink}
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

  const [currentIndex, setCurrentIndex] = useState(
    categoryIndex !== -1 ? categoryIndex : 0,
  );
  const selectedLinkRef = useRef<HTMLAnchorElement | null>(null);

  // Gap between category elements: line-height (1.375rem) + gap (1.5rem) = 2.875rem ≈ 46px at 16px base
  const ITEM_STEP_REM = isMobile ? 2.875 : 5.375;

  const y = useMotionValue(currentIndex);
  const scale = useMotionValue(currentIndex);
  const scaleFactor = isMobile ? 1.75 : 3.1;

  const stepPx = useMemo(() => {
    if (typeof window === "undefined") {
      return 1;
    }

    const rootFontSize = parseFloat(
      window.getComputedStyle(document.documentElement).fontSize,
    );

    return ITEM_STEP_REM * rootFontSize;
  }, [ITEM_STEP_REM]);

  const { index: dragIndex, panHandlers } = useMobileMomentumNav({
    itemCount: categoryTags.length,
    initialIndex: currentIndex,
    stepPx,
    infinite: CATEGORY_NAV_INFINITE,
    isEnabled: isMobile,
    onIndexChange: setCurrentIndex,
  });

  const moveIndex = (direction: -1 | 1) => {
    setCurrentIndex((prevIndex) =>
      Math.min(
        categoryTags.length - 1,
        Math.max(0, prevIndex + direction),
      ),
    );
  };

  useGlobalKeyboardNavigation({
    enabled: !isMobile && categoryTags.length > 1,
    onPrevious: () => moveIndex(-1),
    onNext: () => moveIndex(1),
    onActivate: () => {
      selectedLinkRef.current?.click();
    },
  });

  const { handleWheel } = useDesktopWheelNavigation({
    enabled: !isMobile,
    currentIndex,
    itemCount: categoryTags.length,
    onIndexChange: setCurrentIndex,
  });

  useEffect(() => {
    dispatch(
      setSelectedContentAction({ category: categoryTags[currentIndex] }),
    );

    if (isMobile) {
      return;
    }

    animate(y, currentIndex, { type: "spring", stiffness: 500, damping: 35 });
    animate(scale, currentIndex, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
  }, [currentIndex, y, scale, dispatch, isMobile]);

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    const unsubscribe = dragIndex.on("change", (value) => {
      y.set(value);
      scale.set(value);
    });

    y.set(dragIndex.get());
    scale.set(dragIndex.get());

    return unsubscribe;
  }, [dragIndex, isMobile, scale, y]);

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
      onWheel={handleWheel}
      onPanSessionStart={panHandlers.onPanSessionStart}
      onPan={panHandlers.onPan}
      onPanEnd={panHandlers.onPanEnd}
    >
      <ul className={styles.list}>
        {categoryTags.map((cat, index) => (
          <CategoryNavItem
            key={cat}
            category={cat}
            index={index}
            positionValue={isMobile ? dragIndex : y}
            scaleValue={isMobile ? dragIndex : scale}
            itemStepRem={ITEM_STEP_REM}
            scaleFactor={scaleFactor}
            selectedLinkRef={index === currentIndex ? selectedLinkRef : undefined}
          />
        ))}
      </ul>
    </motion.nav>
  );
};

export default CategoryNavigation;
