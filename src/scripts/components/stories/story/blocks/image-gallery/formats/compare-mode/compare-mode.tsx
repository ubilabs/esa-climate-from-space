import { FunctionComponent, useState } from "react";
import { useFormat } from "../../../../../../../providers/story/format/use-format";
import { FormatContainer } from "../../../../../layout/format-container/format-container";
import { StorySectionProps } from "../../../../../../../types/story";
import { getStoryAssetUrl } from "../../../../../../../libs/get-story-asset-urls";
import styles from "./compare-mode.module.css";
import { CompareImages } from "./compare-images/compare-images";

import cx from "classnames";
import { FormattedMessage, useIntl } from "react-intl";

const CompareMode: FunctionComponent<StorySectionProps> = ({ ref }) => {
  const { content, storyId } = useFormat();
  const { slides } = content;
  const [isComparing, setIsComparing] = useState(false);
  const intl = useIntl();

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
      {!isComparing && (
        <div className={styles.compareModeContent}>
          <p className={styles.description}>{content.description}</p>
          <button
            className={styles.controlButton}
            onClick={() => setIsComparing(true)}
          >
            {isComparing ? "Exit Compare" : "Start Compare"}
          </button>
        </div>
      )}
      {isComparing && (
        <>
          <span aria-describedby="gesture-instructions">
            <FormattedMessage id={"zoomInstruction"} />
          </span>
          <button
            onClick={() => setIsComparing(false)}
            className={styles.closeButton}
            aria-label={intl.formatMessage({ id: "exitFullscreen" })}
          >
            ✕
          </button>
        </>
      )}
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
