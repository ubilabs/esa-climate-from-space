import React, {
  useRef,
  useState,
  useLayoutEffect,
  useEffectEvent,
} from "react";
import cx from "classnames";
import ReactMarkdown from "react-markdown";

import { useAppRouteFlags } from "../../../../../../../../hooks/use-app-route-flags";

import { ScrollImage } from "../../image-scroll/image-scroll-image/image-scroll-image";

import { getStoryAssetUrl } from "../../../../../../../../libs/get-story-asset-urls";

import config from "../../../../../../../../config/main";

import styles from "./carousel-slide.module.css";

interface CarouselSlideProps {
  slide: { url?: string; altText?: string; text?: string };
  index: number;
  isFullscreen: boolean;
  fullscreenSlideIndex: number | undefined;
  onWidthChange: React.Dispatch<React.SetStateAction<number>>;
  storyId: string;
  setIsSlideTouched: (touched: boolean) => void;
  setFullscreenSlideIndex: (index: number | undefined) => void;
}

const CarouselSlide: React.FC<CarouselSlideProps> = ({
  slide,
  index,
  isFullscreen,
  fullscreenSlideIndex,
  onWidthChange,
  storyId,
  setIsSlideTouched,
  setFullscreenSlideIndex,
}) => {
  const { url = "", altText = "", text } = slide;
  const { isStoryEEI } = useAppRouteFlags();
  const isFirstSlide = index === 0;
  const slideRef = useRef<HTMLDivElement>(null);
  const slideTextRef = useRef<HTMLDivElement>(null);
  const [isSlideImageClickable, setIsSlideImageClickable] = useState(false);

  useLayoutEffect(() => {
    if (!isFirstSlide || !slideRef.current) return;
    const width = slideRef.current.offsetWidth;
    onWidthChange((currentWidth) =>
      currentWidth === width ? currentWidth : width,
    );
  }, [isFirstSlide, onWidthChange]);

  const updateImageClickability = useEffectEvent(() => {
    const hasLink = Boolean(slideTextRef.current?.querySelector("a"));
    setIsSlideImageClickable(hasLink);
  });

  // Check if slide text contains a link after render
  useLayoutEffect(() => {
    updateImageClickability();
  }, [text]);

  const handleSlideImageClick = () => {
    // Forward click on image to the text if it contains a link, to make clicking
    // slide image have the same behavior as clicking the text below it
    const link = slideTextRef.current?.querySelector("a");
    if (link) {
      (link as HTMLElement).click();
    }
  };

  return (
    <div
      key={url || index}
      ref={slideRef}
      onTouchStart={() => setIsSlideTouched(true)}
      onTouchEnd={() => setIsSlideTouched(false)}
      className={cx(styles.slide, isStoryEEI && styles.eeiSlide)}
      style={
        isFullscreen && fullscreenSlideIndex !== index
          ? { display: "none" }
          : undefined
      }
    >
      <div
        className={cx(
          styles.imageContainer,
          isStoryEEI && styles.eeiImageContainer,
        )}
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
            onFullscreenToggle={(isFullscreen: boolean) =>
              setFullscreenSlideIndex(isFullscreen ? index : undefined)
            }
          />
        )}
      </div>
      {text && !isFullscreen && (
        <div
          className={cx(styles.text, isStoryEEI && styles.eeiText)}
          ref={slideTextRef}
        >
          <ReactMarkdown
            children={text}
            allowedElements={config.markdownAllowedElements}
          />
        </div>
      )}
    </div>
  );
};

export default CarouselSlide;
