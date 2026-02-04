import { FunctionComponent, useEffect, useEffectEvent, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import cx from "classnames";
import { useModuleContent } from "../../../../../../providers/story/module-content/use-module-content";
import { useLenisToggle } from "../../../../../../hooks/use-lenis-toggle";

import { globeViewSelector } from "../../../../../../selectors/globe/view";
import { languageSelector } from "../../../../../../selectors/language";

import { useGetLayerListQuery } from "../../../../../../services/api";

import { SlideContainer } from "../../../../layout/slide-container/slide-container";
import Globe from "../../../../../legacy-stories/story-globe/story-globe";
import Button from "../../../../../main/button/button";
import { CloseIcon } from "../../../../../main/icons/close-icon";

import styles from "./story-globe.module.css";

const StoryGlobe: FunctionComponent = () => {
  const intl = useIntl();
  const [isInteractive, setIsInteractive] = useState(false);
  const [scrollDisabled, setScrollDisabled] = useState(false);
  const language = useSelector(languageSelector);
  const globalGlobeView = useSelector(globeViewSelector);
  const { data: layers } = useGetLayerListQuery(language);

  const {
    module: { globe },
    getRefCallback,
  } = useModuleContent();

  useLenisToggle(scrollDisabled);

  const toggleScroll = useEffectEvent(() => {
    if (scrollDisabled && !isInteractive) {
      setTimeout(() => {
        setScrollDisabled(false);
      }, 100);
    }
  });

  // Toggle scroll lock only when globe view has been updated.
  // If lock is removed before, the story scroll position may jump.
  useEffect(() => {
    toggleScroll();
  }, [globalGlobeView]);

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
    if (!layerIds || !layers) return undefined;
    return layerIds
      .map((id) => layers.find((layer) => layer.id === id)?.name)
      .filter((name): name is string => !!name)
      .join("/ ");
  };

  return (
    <SlideContainer ref={getRefCallback(0, 0)} className={cx(styles.container)}>
      {!isInteractive ? (
        <button
          className={styles.interactButton}
          onClick={() => {
            setIsInteractive(true);
            setScrollDisabled(true);
          }}
        >
          {intl.formatMessage({ id: "storyGlobe.interact" })}
        </button>
      ) : (
        <Button
          icon={CloseIcon}
          onClick={(e) => {
            e.stopPropagation();
            setIsInteractive(false);
          }}
          className={styles.closeButton}
          aria-label={intl.formatMessage({ id: "storyGlobe.quitInteraction" })}
        ></Button>
      )}
      <Globe
        touchable={isInteractive}
        className={styles.globeContainer}
        globeItem={{
          ...globe,
          layerDescription: getLayerNames(
            globe.layer?.map((layer) => layer.id),
          ),
          // Only autoplay if the user has made the globe interactive
          layerAutoplay: isInteractive && globe.layerAutoplay,
        }}
      />
    </SlideContainer>
  );
};

export default StoryGlobe;
