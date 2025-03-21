import React, { FunctionComponent, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useThunkDispatch } from "../../../hooks/use-thunk-dispatch";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import cx from "classnames";

import { layersApi, useGetStoriesQuery } from "../../../services/api";

import { getNavCoordinates } from "../../../libs/get-navigation-position";

import { setShowLayer } from "../../../reducers/show-layer-selector";
import { setSelectedLayerIds } from "../../../reducers/layers";
import { setSelectedContentAction } from "../../../reducers/content";

import { languageSelector } from "../../../selectors/language";

import { LayerListItem } from "../../../types/layer-list";
import { StoryListItem } from "../../../types/story-list";
import { GalleryItemType } from "../../../types/gallery-item";
import { Story } from "../../../types/story";

import {
  useContentScrollHandlers,
  useContentTouchHandlers,
} from "./use-content-event-handlers";

import styles from "./content-navigation.module.css";
import { toggleEmbedElements } from "../../../reducers/embed-elements";
import { contentSelector } from "../../../selectors/content";

function isStoryListItem(
  obj: StoryListItem | LayerListItem,
): obj is StoryListItem {
  return obj && "title" in obj && "image" in obj;
}

interface Props {
  showContentList: boolean;
  contents: (StoryListItem | LayerListItem)[];
  setSelectedContentId: React.Dispatch<React.SetStateAction<string | null>>;
  category: string | null;
  className?: string;
  isMobile: boolean;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

const ContentNavigation: FunctionComponent<Props> = ({
  category,
  showContentList,
  contents,
  setSelectedContentId,
  className,
  isMobile,
  currentIndex,
  setCurrentIndex,
}) => {
  const navigationRef = React.useRef<HTMLUListElement | null>(null);
  const dispatch = useDispatch();
  const thunkDispatch = useThunkDispatch();
  const { trackEvent } = useMatomo();
  const lang = useSelector(languageSelector);
  const {contentId} = useSelector(contentSelector);

  const isIndexSet = useRef<boolean>(false);

  if (!isIndexSet.current && contents.length > 0) {
    const currentIndex = contents.findIndex((content) => content.id === contentId);
    const centerIndex = Math.floor((contents.length - 1) / 2);
    setCurrentIndex(currentIndex !== -1 ? currentIndex : centerIndex);
    isIndexSet.current = true;
  }
  const { handleTouchEnd, handleTouchMove } = useContentTouchHandlers(
    currentIndex,
    setCurrentIndex,
    contents.length,
  );

  const { handleWheel } = useContentScrollHandlers(
    setCurrentIndex,
    contents.length,
  );

  // The spread between the elements in the circle
  const GAP_BETWEEN_ELEMENTS = 16;

  // The radius of the circle. We use a fixed radius here from
  // 0 - 100 because the coordinates are used as the top and left values
  // in a absolute positioned element. The advantage here is that the the elements
  // will automatically positioned and re-positioned based on the size of the parent container
  const RADIUS = 40;

  useEffect(() => {
    const listItems = navigationRef.current?.querySelectorAll("li");

    if (!listItems) {
      return;
    }

    for (const [index, item] of Array.from(listItems).entries()) {
      const adjustedPosition = index - currentIndex;

      const { x, y } = getNavCoordinates(
        adjustedPosition,
        GAP_BETWEEN_ELEMENTS,
        RADIUS,
        isMobile,
      );

      // 12 degrees of rotation per item
      const _rotationAngle = 12;
      const rotation = adjustedPosition * _rotationAngle;
      const opacity =
        adjustedPosition === 0
          ? 1
          : Math.pow(0.5, Math.abs(adjustedPosition)) * 0.5;

      item.style.top = `${y}%`;
      item.style.left = `${x}%`;
      item.style.opacity = `${opacity}`;
      item.style.rotate = `${rotation}deg`;
      item.classList.toggle(styles.active, adjustedPosition === 0);
    }
  }, [
    currentIndex,
    showContentList,
    contents.length,
    setSelectedContentId,
    isMobile,
  ]);

  useEffect(() => {
    const layerId = contents[currentIndex]?.id;
    dispatch(setSelectedLayerIds({ layerId: layerId, isPrimary: true }));
    const timeout = setTimeout(() => {
      if (contents[currentIndex]) {
        setSelectedContentId(contents[currentIndex].id);
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [dispatch, setSelectedContentId, currentIndex, contents]);

  // Get the middle x coordinate for the highlight of the active item
  const { x } = getNavCoordinates(0, GAP_BETWEEN_ELEMENTS, RADIUS, isMobile);

  const { data: stories } = useGetStoriesQuery({
    ids: contents.filter((el) => isStoryListItem(el)).map(({ id }) => id),
    language: lang,
  });

  const getStoryMediaType = (item: StoryListItem, stories?: Story[]) => {
    let type = "blog";

    const story = stories?.find((story) => story.id === item.id);
    const galleyItemTypes = new Set(
      story?.slides
        .flatMap((slide) => slide.galleryItems)
        .map(({ type }) => type),
    );
    if (
      // if gallery only contains images or videos return media type
      galleyItemTypes.size === 1 &&
      (galleyItemTypes.has(GalleryItemType.Image) ||
        galleyItemTypes.has(GalleryItemType.Video))
    ) {
      type = [...galleyItemTypes][0];
    }
    return type;
  };

  return (
    <ul
      ref={navigationRef}
      className={cx(
        styles.contentNav,
        showContentList && styles.show,
        className,
      )}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onWheel={handleWheel}
    >
      {contents.map((item, index) => {
        const { id } = item;
        const name = "title" in item ? item.title : item.name;
        const isStory = isStoryListItem(item);
        const type = isStory ? getStoryMediaType(item, stories) : "layer";

        return (
          <li
            // Used n CSS to get the correct icon for the content type
            data-content-type={type}
            // Used to identify the currently seletected content.
            // Passed to the globe via props to make sure correct actions are triggered
            // E.g. flyTo or show the data layer
            data-content-id={item.id}
            data-layer-id={isStory ? "" : id}
            className={cx(styles.contentNavItem)}
            key={index}
            aria-label={`${type} content: ${name}`}
            onClick={() => {
              dispatch(setSelectedContentAction({ contentId: id }));
              if (!isStory) {
                dispatch(setShowLayer(false));
                thunkDispatch(layersApi.endpoints.getLayer.initiate(id));
                dispatch(setSelectedLayerIds({ layerId: id, isPrimary: true }));
                dispatch(
                  toggleEmbedElements({ legend: true, time_slider: true }),
                );
                trackEvent({
                  category: "datasets",
                  action: "select",
                  name,
                });
              }
            }}
          >
            <Link
              to={isStory ? `${category}/stories/${id}/0/` : `${category}/data`}
            >
              <span>{name}</span>
              {!isMobile && (
                <span className={cx(styles.learnMore)}>
                  <FormattedMessage id="learn_more" />
                </span>
              )}
            </Link>
          </li>
        );
      })}
      {/* This is the highlight of the currently selected item.
      It serves a visual purpose only */}
      <span
        aria-hidden="true"
        style={{
          // The 8px or 24px is the offset of the highlight to the left
          left: `calc(${x}% - ${isMobile ? "8" : "24"}px)`,
        }}
      ></span>
    </ul>
  );
};

export default ContentNavigation;
