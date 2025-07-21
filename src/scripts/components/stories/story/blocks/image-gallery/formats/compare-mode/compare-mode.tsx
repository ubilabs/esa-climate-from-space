import { FunctionComponent, useState } from "react";

import cx from "classnames";

import { FormattedMessage, useIntl } from "react-intl";
import { useFormat } from "../../../../../../../providers/story/format/use-format";
import { getStoryAssetUrl } from "../../../../../../../libs/get-story-asset-urls";
import { StorySectionProps } from "../../../../../../../types/story";
import { FormatContainer } from "../../../../../layout/format-container/format-container";
import { CompareImages } from "./compare-images/compare-images";

import styles from "./compare-mode.module.css";

const CompareMode: FunctionComponent<StorySectionProps> = ({ ref }) => {
  const {
    content: { slides, description },
    storyId,
  } = useFormat();

  const [isComparing, setIsComparing] = useState(false);
  const intl = useIntl();

  if (!slides || slides.length < 2) {
    console.error("CompareMode requires at least two slides containing image sources to perform a comparison.");
    return null;
  }

  if (slides.length > 2) {
    console.warn(
      "CompareMode currently supports only two images for comparison. Additional images will be ignored.",
    );
  }

  const image1 = slides[0];
  const image2 = slides[1];

  return (
    <FormatContainer
      ref={ref}
      className={cx(styles.compareModeBlock, isComparing && styles.isComparing)}
    >
      {!isComparing ? (
        <div className={styles.compareModeContent}>
          <p className={styles.description}>{description}</p>
          <button
            className={styles.controlButton}
            onClick={() => setIsComparing(true)}
          >
            <FormattedMessage id={"openComparison"} />
          </button>
        </div>
      ) : (
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
