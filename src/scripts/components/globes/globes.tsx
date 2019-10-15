import React, {FunctionComponent, useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {selectedLayersSelector} from '../../reducers/selected-layers';
import {globeViewSelector} from '../../reducers/globe/view';
import {projectionSelector} from '../../reducers/globe/projection';
import Globe from '../globe/globe';

import setGlobeViewAction from '../../actions/set-globe-view';
import GlobeView from '../../types/globe-view';

import styles from './globes.styl';

const Globes: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  const projection = useSelector(projectionSelector);
  const globalGlobeView = useSelector(globeViewSelector);
  const [currentView, setCurrentView] = useState<GlobeView | null>(null);
  const [isMainActive, setIsMainActive] = useState(true);
  const selectedLayers = useSelector(selectedLayersSelector);
  const onChangeHandler = (view: GlobeView) => setCurrentView(view);
  const onMoveEndHandler = (view: GlobeView) =>
    dispatch(setGlobeViewAction(view));

  // apply changes to the app state view to our local view copy
  // we don't use the app state view all the time to keep store updates low
  useEffect(() => {
    if (globalGlobeView) {
      setCurrentView(globalGlobeView);
    }
  }, [globalGlobeView]);

  // only render once the globe view has been set
  if (!currentView || !projection) {
    return null;
  }

  return (
    <div className={styles.globes}>
      <Globe
        active={isMainActive}
        view={currentView}
        projection={projection}
        onMouseEnter={() => setIsMainActive(true)}
        onChange={onChangeHandler}
        onMoveEnd={onMoveEndHandler}
      />

      {selectedLayers.compare && (
        <Globe
          active={!isMainActive}
          view={currentView}
          projection={projection}
          onMouseEnter={() => setIsMainActive(false)}
          onChange={onChangeHandler}
          onMoveEnd={onMoveEndHandler}
        />
      )}
    </div>
  );
};

export default Globes;
