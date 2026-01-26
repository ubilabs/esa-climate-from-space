import {
  FunctionComponent,
  useRef,
  useState,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
} from "react";
import { motion, useAnimationControls } from "motion/react";
import { useIntl } from "react-intl";
import ReactMarkdown from "react-markdown";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";
import { useScreenSize } from "../../../../../../../hooks/use-screen-size";

import config from "../../../../../../../config/main";

import { SlideContainer } from "../../../../../layout/slide-container/slide-container";
import { ScrollImage } from "../image-scroll/image-scroll-image/image-scroll-image";

import { getStoryAssetUrl } from "../../../../../../../libs/get-story-asset-urls";

import styles from "./image-carousel.module.css";

const GAP = 24;
const VELOCITY = 300;

// Image carousel component for displaying a series of images with navigation controls
const ImageCarousel: FunctionComponent = () => {
  const {
    module: { slides },
    storyId,
    getRefCallback,
  } = useModuleContent();
  const { isMobile } = useScreenSize();
  const controls = useAnimationControls();
  const intl = useIntl();

  const slideRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useLayoutEffect(() => {
    if (!slideRef.current) return;
    setSlideWidth(slideRef.current.offsetWidth);
  }, []);

  const step = slideWidth + GAP;

  const updateXPostion = useEffectEvent(() => {
    controls.set({
      x: !isFullscreen ? -index * step : 0,
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
    setIndex(clamped);

    controls.start({
      x: -clamped * step,
      transition: {
        type: "spring",
        stiffness: 320,
        damping: 32,
      },
    });
  };

  return (
    <SlideContainer ref={getRefCallback(0, 0)} className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.slidesContainer}>
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

              snapToIndex(index + direction);
            }}
          >
            {slides.map(({ url, altText, caption }, i) => (
              <div key={i} ref={slideRef} className={styles.slide}>
                <ScrollImage
                  className={styles.image}
                  src={getStoryAssetUrl(storyId, url)}
                  alt={altText}
                  onFullscreenToggle={(isFullscreen) =>
                    setIsFullscreen(isFullscreen)
                  }
                />
                {caption && !isFullscreen && (
                  <div className={styles.caption}>
                    <ReactMarkdown
                      children={caption}
                      allowedElements={config.markdownAllowedElements}
                    />
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {!isFullscreen && (
          <>
            {isMobile ? (
              <div className={styles.navigation}>
                {slides.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.bullet} ${i === index ? styles.active : ""}`}
                    onClick={() => snapToIndex(i)}
                    aria-label={intl.formatMessage(
                      { id: "slides.goTo" },
                      { number: i + 1 },
                    )}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.navigation}>
                <button
                  className={styles.navButton}
                  onClick={() => snapToIndex(index - 1)}
                  disabled={index === 0}
                  aria-label={intl.formatMessage({ id: "slides.previous" })}
                >
                  ‹
                </button>
                <span className={styles.counter}>
                  {index + 1}/{slides.length}
                </span>
                <button
                  className={styles.navButton}
                  onClick={() => snapToIndex(index + 1)}
                  disabled={index === slides.length - 1}
                  aria-label={intl.formatMessage({ id: "slides.next" })}
                >
                  ›
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </SlideContainer>
  );
};

export default ImageCarousel;
