import { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { useStoryGlobe } from "../../../hooks/use-story-globe";
import cx from "classnames";

import { embedElementsSelector } from "../../../selectors/embed-elements-selector";

import LayerDescription from "../layer-description/layer-description";
import { GlobeCompareLayer } from "../../main/globe-compare-layer/globe-compare-layer";
import { selectedLayerIdsSelector } from "../../../selectors/layers/selected-ids";
import { useGetLayerQuery } from "../../../services/api";

import { GlobeItem } from "../../../types/gallery-item";

import styles from "./story-globe.module.css";

interface Props {
  globeItem: GlobeItem;
  touchable?: boolean;
  className?: string;
}

const StoryGlobe: FunctionComponent<Props> = ({
  globeItem,
  touchable = true,
  className,
}) => {
  const { time_slider } = useSelector(embedElementsSelector);

  const { mainId } = useSelector(selectedLayerIdsSelector);

  useGetLayerQuery(mainId ?? "", { skip: !mainId });

  useStoryGlobe(globeItem);

  return (
    <div className={cx(styles.globeContainer, className)}>
      <GlobeCompareLayer
        className={styles.globe}
        autoplay={globeItem.layerAutoplay}
        touchable={touchable}
      />
      {time_slider && (
        <div className={styles.layerDetails}>
          {globeItem.layerDescription && (
            <LayerDescription layerDescription={globeItem.layerDescription} />
          )}
        </div>
      )}
    </div>
  );
};

export default StoryGlobe;
