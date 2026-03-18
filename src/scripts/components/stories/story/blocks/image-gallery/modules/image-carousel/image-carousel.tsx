import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
  useEffectEvent,
} from "react";
import { motion, useAnimationControls } from "motion/react";
import cx from "classnames";
import { FormattedMessage } from "react-intl";

import { useScreenInfo } from "../../../../../../../hooks/use-screen-info";
import { useLenisToggle } from "../../../../../../../hooks/use-lenis-toggle";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import Button from "../../../../../../main/button/button";
import { LinkIcon } from "../../../../../../main/icons/link-icon";
import { ImageCarouselModule } from "../../../../../../../types/story";
import { useAppRouteFlags } from "../../../../../../../hooks/use-app-route-flags";
import { SlideContainer } from "../../../../../layout/slide-container/slide-container";
import CarouselNavigation from "./carousel-navigation/carousel-navigation";
import ImageSlide from "./image-slide/image-slide";
import LayerSlide from "./layer-slide/layer-slide";
import ScrollModule from "../../../story-eei/modules/base-scroll/module/scroll-module";

import styles from "./image-carousel.module.css";

const PADDING = 24;
const VELOCITY = 300;

// Image carousel component for displaying a series of images with navigation controls
const ImageCarousel: FunctionComponent = () => {
  const { module, storyId, getRefCallback } = useModuleContent();
  const { slides, lengthFactor } = module as ImageCarouselModule;
  const { isMobile } = useScreenInfo();
  const controls = useAnimationControls();
  const { isStoryEEI } = useAppRouteFlags();

  const slidesContainerRef = useRef<HTMLDivElement>(null);
  const firstSlideRef = useRef<HTMLDivElement | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [fullscreenSlideIndex, setFullscreenSlideIndex] = useState<
    number | undefined
  >();
  const [isSlideTouched, setIsSlideTouched] = useState(false);
  const [isNavigationVisible, setIsNavigationVisible] = useState(true);
  const isFullscreen = fullscreenSlideIndex !== undefined;

  useLenisToggle(isSlideTouched);

  const step = slideWidth + PADDING;

  const updateNavigationVisibility = useEffectEvent(() => {
    // Show navigation if the slides are wider than current viewport
    setIsNavigationVisible(
      (slidesContainerRef.current?.offsetWidth || 0) <
        (slides?.length || 0) * slideWidth,
    );
  });

  useEffect(() => {
    updateNavigationVisibility();
  }, [slideWidth, slides?.length]);

  const setFirstSlideRef = useCallback((node: HTMLDivElement | null) => {
    firstSlideRef.current = node;
    if (!node) return;

    const width = node.offsetWidth;
    setSlideWidth((currentWidth) =>
      currentWidth === width ? currentWidth : width,
    );
  }, []);

  const updateXPostion = useEffectEvent(() => {
    controls.set({
      x: !isFullscreen ? -currentSlideIndex * step : 0,
    });
  });

  // In fulllscreen mode update x position to center the current selected slide
  useEffect(() => {
    updateXPostion();
  }, [isFullscreen]);

  if (!slides || slides.length === 0) {
    console.error(
      "ImageCarousel requires at least one slide with an image source.",
    );
    return null;
  }

  const snapToIndex = (i: number) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, i));
    setCurrentSlideIndex(clamped);

    controls.start({
      x: -clamped * step,
      transition: {
        type: "spring",
        stiffness: 320,
        damping: 32,
      },
    });
  };

  const content = (
    <SlideContainer
      ref={getRefCallback(0, 0)}
      className={cx(styles.container, !isMobile && !isStoryEEI && "story-grid")}
    >
      <div className={cx(styles.wrapper)}>
        {"headerText" in module && module.headerText && (
          <h1>{module.headerText}</h1>
        )}
        <div className={styles.slidesContainer} ref={slidesContainerRef}>
          <motion.div
            className={styles.track}
            animate={controls}
            drag={isMobile && !isFullscreen ? "x" : false}
            dragConstraints={{
              left: -(slides.length - 1) * step,
              right: 0,
            }}
            dragElastic={0.08}
            onDragEnd={(_, info) => {
              const dragged = info.offset.x;
              const velocity = info.velocity.x;

              const direction =
                dragged < -step / 4 || velocity < -VELOCITY
                  ? 1
                  : dragged > step / 4 || velocity > VELOCITY
                    ? -1
                    : 0;

              snapToIndex(currentSlideIndex + direction);
            }}
          >
            {slides.map((slide, index) => {
              const slideProps = {
                slide,
                index,
                isFullscreen,
                fullscreenSlideIndex,
                slideElementRef: index === 0 ? setFirstSlideRef : undefined,
                storyId,
                setIsSlideTouched,
                setFullscreenSlideIndex,
              };
              const key = slide.url || index;

              return "layer" in slide ? (
                <LayerSlide key={key} {...slideProps} />
              ) : (
                <ImageSlide key={key} {...slideProps} />
              );
            })}
          </motion.div>
        </div>
        {!isFullscreen && isNavigationVisible && (
          <CarouselNavigation
            index={currentSlideIndex}
            slides={slides}
            snapToIndex={snapToIndex}
          />
        )}
        {"readMore" in module &&
          module.readMore?.url &&
          URL.canParse(module.readMore.url) && (
            <div className={styles.readMore}>
              <FormattedMessage id="story.slide.readMore" />
              <Button
                className={styles.readMoreButton}
                link={module.readMore.url}
                isExternalLink
              >
                <span>{module.readMore.title}</span>
                <LinkIcon />
              </Button>
            </div>
          )}
      </div>
    </SlideContainer>
  );

  return lengthFactor ? (
    <ScrollModule lengthFactor={lengthFactor} config={{}}>
      {content}
    </ScrollModule>
  ) : (
    content
  );
};

export default ImageCarousel;
