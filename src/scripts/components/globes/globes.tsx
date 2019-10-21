import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback
} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {selectedLayersSelector} from '../../reducers/selected-layers';
import {globeViewSelector} from '../../reducers/globe/view';
import {projectionSelector} from '../../reducers/globe/projection';
import setGlobeViewAction from '../../actions/set-globe-view';
import Globe from '../globe/globe';

import {GlobeView} from '../../types/globe-view';

import styles from './globes.styl';

const Globes: FunctionComponent = () => {
  const dispatch = useDispatch();
  const projection = useSelector(projectionSelector);
  const globalGlobeView = useSelector(globeViewSelector);
  const [currentView, setCurrentView] = useState(globalGlobeView);
  const [isMainActive, setIsMainActive] = useState(true);
  const selectedLayers = useSelector(selectedLayersSelector);
  const onChangeHandler = useCallback(
    (view: GlobeView) => setCurrentView(view),
    []
  );
  const onMoveEndHandler = useCallback(
    (view: GlobeView) => dispatch(setGlobeViewAction(view)),
    [dispatch]
  );

  // apply changes in the app state view to our local view copy
  // we don't use the app state view all the time to keep store updates low
  useEffect(() => {
    setCurrentView(globalGlobeView);
  }, [globalGlobeView]);

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
