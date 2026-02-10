import { FunctionComponent, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import cx from "classnames";

import { useModuleContent } from "../../../../../../providers/story/module-content/use-module-content";
import { useLenisToggle } from "../../../../../../hooks/use-lenis-toggle";

import { languageSelector } from "../../../../../../selectors/language";
import { embedElementsSelector } from "../../../../../../selectors/embed-elements-selector";

import { setGlobeTime } from "../../../../../../reducers/globe/time";

import { useGetLayerListQuery } from "../../../../../../services/api";

import { SlideContainer } from "../../../../layout/slide-container/slide-container";
import { GlobeCompareLayer } from "../../../../../main/globe-compare-layer/globe-compare-layer";
import LayerDescription from "../../../../../legacy-stories/layer-description/layer-description";
import Button from "../../../../../main/button/button";
import { CloseIcon } from "../../../../../main/icons/close-icon";

import styles from "./story-globe.module.css";

const StoryGlobe: FunctionComponent = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [isInteractive, setIsInteractive] = useState(false);
  const language = useSelector(languageSelector);
  const { data: layers } = useGetLayerListQuery(language);
  const { time_slider } = useSelector(embedElementsSelector);

  const {
    module: { globe },
    getRefCallback,
  } = useModuleContent();

  useLenisToggle(isInteractive);

  // Apply time from globeItem if interactive state is enabled
  useEffect(() => {
    if (globe && isInteractive) {
      const [mainLayer] = globe?.layer || [];
      const time = mainLayer?.timestamp
        ? new Date(mainLayer.timestamp).getTime()
        : null;
      if (time) {
        dispatch(setGlobeTime(time));
      }
    }
  }, [globe, isInteractive, dispatch]);

  if (!globe) {
    return null;
  }

  /**
   * Returns a formatted string of layer names based on provided layer IDs
   * E.g. "Layer 1 / Layer 2 / Layer 3"
   *
   * @param layerIds - Array of layer IDs to retrieve names for
   * @returns Formatted string of layer names or undefined if no valid names found
   */
  const getLayerNames = (layerIds: string[] | undefined) => {
    if (!layerIds || !layers) return "";
    return layerIds
      .map((id) => layers.find((layer) => layer.id === id)?.name)
      .filter((name): name is string => !!name)
      .join("/ ");
  };

  return (
    <SlideContainer ref={getRefCallback(0, 0)} className={cx(styles.container)}>
      {!isInteractive ? (
        <Button
          className={styles.interactButton}
          onClick={() => setIsInteractive(true)}
          aria-label={intl.formatMessage({ id: "storyGlobe.interact" })}
        >
          {intl.formatMessage({ id: "storyGlobe.interact" })}
        </Button>
      ) : (
        <Button
          icon={CloseIcon}
          onClick={() => setIsInteractive(false)}
          className={styles.closeButton}
          aria-label={intl.formatMessage({ id: "storyGlobe.quitInteraction" })}
        ></Button>
      )}
      <div className={styles.globeContainer}>
        <GlobeCompareLayer
          className={styles.globe}
          globeItem={globe}
          autoplay={globe?.layerAutoplay && isInteractive}
          touchable={isInteractive}
        />
        {time_slider && (
          <div className={styles.layerDetails}>
            <LayerDescription
              layerDescription={getLayerNames(
                globe?.layer?.map((layer) => layer.id),
              )}
            />
          </div>
        )}
      </div>
    </SlideContainer>
  );
};

export default StoryGlobe;
