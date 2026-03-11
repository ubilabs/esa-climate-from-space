import {
  FunctionComponent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useEffectEvent,
} from "react";
import { motion, useAnimationControls } from "motion/react";
import cx from "classnames";
import ReactMarkdown from "react-markdown";
import { FormattedMessage } from "react-intl";

import config from "../../../../../../../config/main";
import { useScreenSize } from "../../../../../../../hooks/use-screen-size";
import { useLenisToggle } from "../../../../../../../hooks/use-lenis-toggle";
import { getStoryAssetUrl } from "../../../../../../../libs/get-story-asset-urls";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import Button from "../../../../../../main/button/button";
import { LinkIcon } from "../../../../../../main/icons/link-icon";
import { ImageCarouselModule } from "../../../../../../../types/story";
import { useAppRouteFlags } from "../../../../../../../hooks/use-app-route-flags";
import { SlideContainer } from "../../../../../layout/slide-container/slide-container";
import { ScrollImage } from "../image-scroll/image-scroll-image/image-scroll-image";
import CarouselNavigation from "./carousel-navigation/carousel-navigation";
import ScrollModule from "../../../story-eei/modules/base-scroll/module/scroll-module";

import styles from "./image-carousel.module.css";

const PADDING = 24;
const VELOCITY = 300;

// Image carousel component for displaying a series of images with navigation controls
const ImageCarousel: FunctionComponent = () => {
  const { module, storyId, getRefCallback } = useModuleContent();
  const { slides, lengthFactor } = module as ImageCarouselModule;
  const { isMobile } = useScreenSize();
  const controls = useAnimationControls();
  const { isStoryEEI } = useAppRouteFlags();

  const slidesContainerRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const slideTextRef = useRef<HTMLDivElement>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [fullscreenSlideIndex, setFullscreenSlideIndex] = useState<
    number | undefined
  >();
  const [isSlideTouched, setIsSlideTouched] = useState(false);
  const [isNavigationVisible, setIsNavigationVisible] = useState(true);
  const [isSlideImageClickable, setIsSlideImageClickable] = useState(false);
  const isFullscreen = fullscreenSlideIndex !== undefined;

  useLenisToggle(isSlideTouched);

  useLayoutEffect(() => {
    if (!slideRef.current) return;
    setSlideWidth(slideRef.current.offsetWidth);
  }, []);

  const toggleSlideImageClickability = useEffectEvent(() =>
    // Make slide image clickable if the slide text contains a link
    setIsSlideImageClickable(Boolean(slideTextRef.current?.querySelector("a"))),
  );

  useEffect(() => toggleSlideImageClickability(), [slideTextRef]);

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

  const handleSlideImageClick = () => {
    // Forward click on image to the text if it contains a link, to make clicking
    // slide image have the same behavior as clicking the text below it
    slideTextRef.current?.querySelector("a")?.click();
  };

  const content = (
    <SlideContainer
      ref={getRefCallback(0, 0)}
      className={cx(styles.container, !isMobile && "story-grid")}
    >
      <div className={cx(styles.wrapper, isStoryEEI && styles.eeiWrapper)}>
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
            {slides.map(({ url, altText, text }, i) => (
              <div
                key={url || i}
                ref={i === 0 ? slideRef : null}
                onTouchStart={() => setIsSlideTouched(true)}
                onTouchEnd={() => setIsSlideTouched(false)}
                className={styles.slide}
                style={
                  isFullscreen && fullscreenSlideIndex !== i
                    ? { display: "none" }
                    : undefined
                }
              >
                <div
                  className={styles.imageContainer}
                  onClick={handleSlideImageClick}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      handleSlideImageClick();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {isSlideImageClickable ? (
                    <img
                      className={styles.image}
                      src={getStoryAssetUrl(storyId, url)}
                      style={{ cursor: "pointer" }}
                      alt={altText}
                    />
                  ) : (
                    <ScrollImage
                      className={styles.image}
                      src={getStoryAssetUrl(storyId, url)}
                      alt={altText}
                      onFullscreenToggle={(isFullscreen) =>
                        setFullscreenSlideIndex(isFullscreen ? i : undefined)
                      }
                    />
                  )}
                </div>
                {text && !isFullscreen && (
                  <div className={styles.text} ref={slideTextRef}>
                    <ReactMarkdown
                      children={text}
                      allowedElements={config.markdownAllowedElements}
                    />
                  </div>
                )}
              </div>
            ))}
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
