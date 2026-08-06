import { FunctionComponent } from "react";
import { StorySectionProps } from "../../../../../../types/story";

import { useModuleContent } from "../../../../../../providers/story/module-content/use-module-content";
import { TextOverlaySlide } from "./text-overlay-slide/text-overlay-slide";

import { calculateTotalSlides } from "../../../../../../libs/split-text";
import { getStoryAssetUrl } from "../../../../../../libs/get-story-asset-urls";
import { isVideo } from "../../../../../../libs/is-video";

import cx from "classnames";

import styles from "./text-overlay.module.css";

const TextOverlay: FunctionComponent<StorySectionProps> = () => {
  const { module, storyId, getRefCallback } = useModuleContent();
  const { url, slides = [], focus, altText } = module;

  const assetUrl = getStoryAssetUrl(storyId, url);
  const hasAsset = assetUrl && assetUrl.length > 0;

  const totalSlides = calculateTotalSlides(slides);

  return (
    <div className={styles.textOverlay}>
      <div
        className={cx(styles.slide)}
        style={{
          height: `calc(${totalSlides} * var(--story-height))`,
        }}
      >
        <div className={styles.assetContainer}>
          {hasAsset &&
            (isVideo(url) ? (
              <video
                className={styles.asset}
                src={assetUrl}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                className={cx(styles.asset, focus)}
                src={assetUrl}
                alt={altText || ""}
              />
            ))}
        </div>
        <div className={styles.slidesContainer}>
          {slides?.map((slide, index) => (
            <TextOverlaySlide
              getRefCallback={getRefCallback}
              index={index}
              key={index}
              storyId={storyId}
              slide={slide}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextOverlay;
