import React, {FunctionComponent} from 'react';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import cx from 'classnames';

import {GlobeView} from '../../../types/globe-view';

import {GlobeProjectionState} from '../../../types/globe-projection-state';
import {Layer} from '../../../types/layer';
import {Marker} from '../../../types/marker-type';
import {GlobeImageLayerData} from '../../../types/globe-image-layer-data';

import styles from './globe.module.styl';

interface Props {
  active: boolean;
  view: GlobeView;
  projectionState: GlobeProjectionState;
  imageLayer: GlobeImageLayerData | null;
  layerDetails: Layer | null;
  spinning: boolean;
  flyTo: GlobeView | null;
  markers?: Marker[];
  backgroundColor: string;
  onMouseEnter: () => void;
  onTouchStart: () => void;
  onChange: (view: GlobeView) => void;
  onMoveEnd: (view: GlobeView) => void;
  onMouseDown: () => void;
}

const Globe: FunctionComponent<Props> = props => {
  const {
    // view,
    // projectionState,
    // imageLayer,
    // layerDetails,
    // spinning,
    // active,
    // flyTo,
    // markers = [],
    // backgroundColor,
    onMouseEnter,
    onTouchStart
    // onChange,
    // onMoveEnd,
    // onMouseDown
  } = props;

  return (
    <div
      className={cx(styles.globe, styles.fadeIn)}
      onMouseEnter={() => onMouseEnter()}
      onTouchStart={() => onTouchStart()}>
      I wanna be a globe when I grow up!
    </div>
  );
};

export default Globe;
