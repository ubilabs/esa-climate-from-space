import React, {FunctionComponent, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {selectedLayersSelector} from '../../reducers/selected-layers';
import {globeViewSelector} from '../../reducers/globe/view';
import {projectionSelector} from '../../reducers/globe/projection';
import Globe from '../globe/globe';

import GlobeView from '../../types/globe-view';

import styles from './globes.styl';

const Globes: FunctionComponent<{}> = () => {
  const projection = useSelector(projectionSelector);
  const [isMainActive, setIsMainActive] = useState(true);
  const selectedLayers = useSelector(selectedLayersSelector);
  const onChangeHandler = (view: View) => setCurrentView(view);

  return (
    <div className={styles.globes}>
      <Globe
        active={isMainActive}
        view={currentView}
        projection={projection}
        onMouseEnter={() => setIsMainActive(true)}
        onChange={onChangeHandler}
      />

      {selectedLayers.compare && (
        <Globe
          active={!isMainActive}
          view={currentView}
          projection={projection}
          onMouseEnter={() => setIsMainActive(false)}
          onChange={onChangeHandler}
        />
      )}
    </div>
  );
};

export default Globes;
