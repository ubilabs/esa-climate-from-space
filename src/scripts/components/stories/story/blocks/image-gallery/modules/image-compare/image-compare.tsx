import { FunctionComponent, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { StorySectionProps } from "../../../../../../../types/story";
import { InstructionOverlay } from "../../../../../../ui/instruction-overlay/instruction-overlay";
import { SlideContainer } from "../../../../../layout/slide-container/slide-container";
import { ComparisonViewer } from "./comparison-viewer/comparison-viewer";

import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";
import { useScreenSize } from "../../../../../../../hooks/use-screen-size";

import cx from "classnames";

import styles from "./image-compare.module.css";

const ImageCompare: FunctionComponent<StorySectionProps> = () => {
  const {
    module: { slides, text, startButtonText },
    storyId,
    getRefCallback,
  } = useModuleContent();

  const [isComparing, setIsComparing] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { isMobile } = useScreenSize();
  const intl = useIntl();

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
    <SlideContainer
      ref={getRefCallback(0, 0)}
      className={cx(styles.imageCompare, isComparing && styles.isComparing)}
    >
      {!isComparing ? (
        <div className={styles.compareModeContent}>
          <p className={styles.description}>{text}</p>
          <button
            className={styles.controlButton}
            onClick={() => {
              setIsComparing(true);
              setShowInstructions(true);
            }}
          >
            {startButtonText ? (
              startButtonText
            ) : (
              <FormattedMessage id={"openComparison"} />
            )}
          </button>
        </div>
      ) : (
        <>
          {isMobile && (
            <InstructionOverlay
              show={showInstructions}
              messageId="zoomInstruction"
            />
          )}
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
    </SlideContainer>
  );
};

export default ImageCompare;
