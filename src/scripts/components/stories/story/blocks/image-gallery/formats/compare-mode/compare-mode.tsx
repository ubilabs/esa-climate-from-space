import { FunctionComponent, useState, useEffect } from "react";
import cx from "classnames";
import { FormattedMessage, useIntl } from "react-intl";
import { useFormat } from "../../../../../../../providers/story/format/use-format";
import { StorySectionProps } from "../../../../../../../types/story";
import { FormatContainer } from "../../../../../layout/format-container/format-container";
import { CompareImages } from "./compare-images/compare-images";
import { InstructionOverlay } from "../../../../../../ui/instruction-overlay/instruction-overlay";

import styles from "./compare-mode.module.css";

const CompareMode: FunctionComponent<StorySectionProps> = ({ ref }) => {
  const {
    content: { slides, text, buttonText },
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
      className={cx(styles.compareModeBlock, isComparing && styles.isComparing)}
    >
      {!isComparing ? (
        <div className={styles.compareModeContent}>
          <p className={styles.description}>{text}</p>
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
      <CompareImages
        onInteraction={handleInteraction}
        isComparing={isComparing}
        slide1={slides[0]}
        slide2={slides[1]}
        storyId={storyId}
      />
    </FormatContainer>
  );
};

export default CompareMode;
