import { FunctionComponent, useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useFormat } from "../../../../../../../providers/story/format/use-format";
import { StorySectionProps } from "../../../../../../../types/story";
import { FormatContainer } from "../../../../../layout/format-container/format-container";
import { InstructionOverlay } from "../../../../../../ui/instruction-overlay/instruction-overlay";
import { ComparisonViewer } from "./comparison-viewer/comparison-viewer";

import cx from "classnames";

import styles from "./image-compare.module.css";

const ImageCompare: FunctionComponent<StorySectionProps> = ({ ref }) => {
  const {
    content: { slides, description, buttonText },
    storyId,
  } = useFormat();

  const [isComparing, setIsComparing] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const intl = useIntl();

  useEffect(() => {
    if (isComparing) {
      setShowInstructions(true);
    }
  }, [isComparing]);

  if (!slides || slides.length < 2) {
    console.error(
      "CompareMode requires at least two slides containing image sources to perform a comparison.",
    );
    return null;
  }

  if (slides.length > 2) {
    console.warn(
      "CompareMode currently supports only two images for comparison. Additional images will be ignored.",
    );
  }

  const handleInteraction = () => {
    if (showInstructions) {
      setShowInstructions(false);
    }
  };

  return (
    <FormatContainer
      ref={ref}
      className={cx(styles.imageCompare, isComparing && styles.isComparing)}
    >
      {!isComparing ? (
        <div className={styles.compareModeContent}>
          <p className={styles.description}>{description}</p>
          <button
            className={styles.controlButton}
            onClick={() => setIsComparing(true)}
          >
            {buttonText ? (
              buttonText
            ) : (
              <FormattedMessage id={"openComparison"} />
            )}
          </button>
        </div>
      ) : (
        <>
          <InstructionOverlay
            show={showInstructions}
            messageId="zoomInstruction"
          />
          <button
            onClick={() => setIsComparing(false)}
            className={styles.closeButton}
            aria-label={intl.formatMessage({ id: "exitFullscreen" })}
          >
            ✕
          </button>
        </>
      )}
      <ComparisonViewer
        onInteraction={handleInteraction}
        isComparing={isComparing}
        slide1={slides[0]}
        slide2={slides[1]}
        storyId={storyId}
      />
    </FormatContainer>
  );
};

export default ImageCompare;
