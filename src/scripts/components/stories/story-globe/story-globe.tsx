import { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { useStoryGlobe } from "../../../hooks/use-story-globe";

import { embedElementsSelector } from "../../../selectors/embed-elements-selector";

import TimeSlider from "../../layers/time-slider/time-slider";
import LayerDescription from "../layer-description/layer-description";
import { selectedLayerIdsSelector } from "../../../selectors/layers/selected-ids";
import { GlobeCompareLayer } from "../../main/globe-compare-layer/globe-compare-layer";
import { useGetLayerQuery } from "../../../services/api";

import { GlobeItem } from "../../../types/gallery-item";

import styles from "./story-globe.module.css";

interface Props {
  globeItem: GlobeItem;
}

const StoryGlobe: FunctionComponent<Props> = ({ globeItem }) => {
  const { time_slider } = useSelector(embedElementsSelector);

  const { mainId } = useSelector(selectedLayerIdsSelector);

  useGetLayerQuery(mainId ?? "", { skip: !mainId });

  useStoryGlobe(globeItem);

  return (
    <div className={styles.globeContainer}>
      <GlobeCompareLayer
        markers={globeItem.markers}
        backgroundColor={"var(--plain-black)"}
      />
      {time_slider && (
        <div className={styles.layerDetails}>
          <TimeSlider noTimeClamp className={styles.storySlider} />
          {globeItem.layerDescription && (
            <LayerDescription layerDescription={globeItem.layerDescription} />
          )}
        </div>
      )}
    </div>
  );
};

export default StoryGlobe;
