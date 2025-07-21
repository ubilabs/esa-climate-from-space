import { FunctionComponent, useState } from "react";
import { useFormat } from "../../../../../../../providers/story/format/use-format";
import { FormatContainer } from "../../../../../layout/format-container/format-container";
import { StorySectionProps } from "../../../../../../../types/story";
import { getStoryAssetUrl } from "../../../../../../../libs/get-story-asset-urls";
import styles from "./compare-mode.module.css";
import { CompareImages } from "./compare-images/compare-images";

import cx from "classnames";

const CompareMode: FunctionComponent<StorySectionProps> = ({ ref }) => {
  const { content, storyId } = useFormat();
  const { slides } = content;
  const [isComparing, setIsComparing] = useState(false);
  console.log("CompareMode content:", content);

  if (!slides || slides.length < 2) {
    console.warn("CompareMode requires at least two images to compare.");
    return null;
  }

  const image1 = slides[0];
  const image2 = slides[1];

  return (
    <FormatContainer
      ref={ref}
      className={cx(styles.compareModeBlock, isComparing && styles.isComparing)}
    >
      <div
        className={cx(
          styles.compareModeContent,
          isComparing && styles.isComparing,
        )}
      >
        <p className={styles.description}>{content.description}</p>
        <button
          className={styles.controlButton}
          onClick={() => setIsComparing((prev) => !prev)}
        >
          {isComparing ? "Exit Compare" : "Start Compare"}
        </button>
      </div>
      <CompareImages
        isComparing={isComparing}
        src1={getStoryAssetUrl(storyId, image1.url)}
        alt1={image1.caption || image1.altText}
        src2={getStoryAssetUrl(storyId, image2.url)}
        alt2={image2.caption || image2.altText}
      />
    </FormatContainer>
  );
};

export default CompareMode;
