import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';
import {useStoryGlobe} from '../../../hooks/use-story-globe';

import {embedElementsSelector} from '../../../selectors/embed-elements-selector';

import DataViewer from '../../main/data-viewer/data-viewer';
import TimeSlider from '../../layers/time-slider/time-slider';
import LayerDescription from '../layer-description/layer-description';

import {GlobeItem} from '../../../types/gallery-item';

import styles from './story-globe.module.css';

interface Props {
  globeItem: GlobeItem;
}

const StoryGlobe: FunctionComponent<Props> = ({globeItem}) => {
  // eslint-disable-next-line camelcase
  const {time_slider} = useSelector(embedElementsSelector);

  useStoryGlobe(globeItem);

  return (
    <div className={styles.globeContainer}>
      <DataViewer
        hideNavigation
        markers={globeItem.markers}
        backgroundColor={'#000000'}
      />
      {/* eslint-disable-next-line camelcase */}
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
