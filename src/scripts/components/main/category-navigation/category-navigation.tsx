import {
  FunctionComponent,
  useEffect,
  useLayoutEffect,
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

  const [currentIndex, setCurrentIndex] = useState(
    categoryIndex !== -1 ? categoryIndex : 0,
  );
  const [previewIndex, setPreviewIndex] = useState(
    categoryIndex !== -1 ? categoryIndex : 0,
  );
  const selectedLinkRef = useRef<HTMLAnchorElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const [stepPx, setStepPx] = useState(1);

  // Gap between category elements: line-height (1.375rem) + gap (1.5rem) = 2.875rem ≈ 46px at 16px base
  const ITEM_STEP_REM = isMobile ? 2.875 : 5.375;

  const y = useMotionValue(currentIndex);
  const scale = useMotionValue(currentIndex);
  const scaleFactor = isMobile ? 1.75 : 3.1;

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

  const {
    handleWheel: handleDesktopWheel,
    previewIndex: desktopPreviewIndex,
    isInteracting: isDesktopInteracting,
  } = useDesktopWheelNavigation({
    enabled: !isMobile,
    currentIndex,
    itemCount: categoryTags.length,
    stepPx,
    onIndexChange: setCurrentIndex,
  });

  useLayoutEffect(() => {
    if (!listRef.current || categoryTags.length <= 1) {
      return;
    }

    const measureStep = () => {
      const items = Array.from(
        listRef.current?.querySelectorAll<HTMLLIElement>("li[data-index]") ?? [],
      );

      if (items.length <= 1) {
        return;
      }

      const activeItemIndex = Math.min(currentIndex, items.length - 2);
      const currentItem = items[activeItemIndex];
      const nextItem = items[activeItemIndex + 1];

      if (!currentItem || !nextItem) {
        return;
      }

      const currentTop = currentItem.getBoundingClientRect().top;
      const nextTop = nextItem.getBoundingClientRect().top;
      const nextStep = Math.abs(nextTop - currentTop);

      if (nextStep > 0) {
        setStepPx(nextStep);
      }
    };

    measureStep();
    window.addEventListener("resize", measureStep);

    return () => {
      window.removeEventListener("resize", measureStep);
    };
  }, [currentIndex]);

  useEffect(() => {
    dispatch(
      setSelectedContentAction({ category: categoryTags[currentIndex] }),
    );

    if (isMobile) {
      return;
    }

    setPreviewIndex(currentIndex);

    const yAnimation = animate(y, currentIndex, {
      type: "tween",
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1],
    });
    const scaleAnimation = animate(scale, currentIndex, {
      type: "tween",
      duration: 0.18,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => {
      yAnimation.stop();
      scaleAnimation.stop();
    };
  }, [currentIndex, y, scale, dispatch, isMobile]);

  useEffect(() => {
    if (!isMobile) {
      if (!isDesktopInteracting) {
        return;
      }

      const unsubscribe = desktopPreviewIndex.on("change", (value) => {
        y.set(value);
        scale.set(value);
        setPreviewIndex(Math.round(value));
      });

      const nextIndex = desktopPreviewIndex.get();
      y.set(nextIndex);
      scale.set(nextIndex);
      setPreviewIndex(Math.round(nextIndex));

      return unsubscribe;
    }

    const unsubscribe = dragIndex.on("change", (value) => {
      y.set(value);
      scale.set(value);
      setPreviewIndex(Math.round(value));
    });

    y.set(dragIndex.get());
    scale.set(dragIndex.get());
    setPreviewIndex(Math.round(dragIndex.get()));

    return unsubscribe;
  }, [desktopPreviewIndex, dragIndex, isDesktopInteracting, isMobile, scale, y]);

  useEffect(() => {
    setPreviewIndex(currentIndex);
  }, [currentIndex]);

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
      onWheel={handleDesktopWheel}
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
