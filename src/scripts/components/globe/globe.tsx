import React, {FunctionComponent, useRef, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {projectionSelector} from '../../reducers/projection';
import {Projection} from '../../actions/set-projection';
import getGlobeView, {plainViewToCesiumView} from '../../libs/get-globe-view';
import {View} from '../globes/globes';
import config from '../../config/main';

import 'cesium/Source/Widgets/widgets.css';
import 'cesium/Build/Cesium/Cesium';

import styles from './globe.styl';

const Cesium = window.Cesium;
// set global base url
Cesium.buildModuleUrl.setBaseUrl('./cesium/');
// we do not use cesium ion tile server
// @ts-ignore
Cesium.Ion.defaultAccessToken = '';
// create default imagery provider
// @ts-ignore
const tileUrl = window.Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII');
const imageryProvider = window.Cesium.createTileMapServiceImageryProvider({
  url: tileUrl
});

interface Props {
  active: boolean;
  view: View;
  onMouseEnter: () => void;
  onChange: (view: View) => void;
}

const Globe: FunctionComponent<Props> = ({
  view,
  active,
  onMouseEnter,
  onChange
}) => {
  const [viewer, setViewer] = useState<Cesium.Viewer | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const projection = useSelector(projectionSelector);

  // make latest "active" value always accessible in camera change handler
  const isActiveRef = useRef<boolean>(active);
  isActiveRef.current = active;

  // init cesium viewer
  useEffect(() => {
    if (!ref || !ref.current) {
      return () => {};
    }

    // create cesium viewer
    const options = {
      ...config.globe.options,
      imageryProvider
    };
    const scopedViewer = new Cesium.Viewer(ref.current, options);

    // save viewer reference
    setViewer(scopedViewer);

    // set initial camera view
    scopedViewer.scene.camera.setView(plainViewToCesiumView(view));

    // make camera change listener more sensitiv
    scopedViewer.camera.percentageChanged = 0.01;

    // add camera change listener
    scopedViewer.camera.changed.addEventListener(() => {
      isActiveRef.current && onChange(getGlobeView(scopedViewer));
    });

    // clean up
    return () => {
      scopedViewer.destroy();
      setViewer(null);
    };
  }, [ref]);

  // switch projections
  useEffect(() => {
    if (!viewer) {
      return;
    }

    projection === Projection.Sphere
      ? viewer.scene.morphTo3D()
      : viewer.scene.morphTo2D();
  }, [viewer, projection]);

  // update position and distance when view changes
  useEffect(() => {
    if (!view || !viewer) {
      return;
    }

    // only apply view changes when they come from another globe
    if (active) {
      return;
    }

    viewer.scene.camera.setView(plainViewToCesiumView(view));
  }, [viewer, view]);

  return (
    <div
      className={styles.globe}
      onMouseEnter={() => onMouseEnter()}
      ref={ref}
    />
  );
};

export default Globe;
