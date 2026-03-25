import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import cx from "classnames";

import { setSelectedLayerIds } from "../../../../../../../../reducers/layers";
import { languageSelector } from "../../../../../../../../selectors/language";

import { useGetLayerListQuery } from "../../../../../../../../services/api";

import { getStoryAssetUrl } from "../../../../../../../../libs/get-story-asset-urls";

import { ImageCarouselSlide } from "../../../../../../../../types/story";

import styles from "./layer-slide.module.css";

interface LayerSlideProps {
  slide: ImageCarouselSlide;
  slideElementRef?: React.Ref<HTMLDivElement>;
  storyId: string;
}

const LayerSlide: React.FC<LayerSlideProps> = ({
  slide,
  slideElementRef,
  storyId,
}) => {
  const dispatch = useDispatch();
  const language = useSelector(languageSelector);
  const { data: layers } = useGetLayerListQuery(language);
  const { url = "", altText = "", layer } = slide;
  const category = layers?.find((l) => l.id === layer?.layerId)?.categories[0];

  return (
    <div ref={slideElementRef} className={cx(styles.slide)}>
      {layer && category && (
        <Link
          to={`/${category}/data`}
          onClick={() =>
            dispatch(
              setSelectedLayerIds({
                layerId: layer?.layerId ?? null,
                isPrimary: true,
              }),
            )
          }
        >
          <div className={cx(styles.imageContainer)}>
            <img
              className={styles.image}
              src={getStoryAssetUrl(storyId, url)}
              alt={altText}
            />
          </div>
          <span className={styles.text}>{layer.name}</span>
        </Link>
      )}
    </div>
  );
};

export default LayerSlide;
