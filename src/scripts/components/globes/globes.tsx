import React, {FunctionComponent, useState} from 'react';
import {useSelector} from 'react-redux';

import {selectedLayersSelector} from '../../reducers/selected-layers';
import Globe from '../globe/globe';
import config from '../../config/main';

import styles from './globes.styl';

export interface View {
  destination: [number, number, number];
  orientation: {
    heading: number;
    pitch: number;
    roll: number;
  };
}

const Globes: FunctionComponent<{}> = () => {
  const initialView = config.globe.view as View;
  const [currentView, setCurrentView] = useState<View>(initialView);
  const [isMainActive, setIsMainActive] = useState(true);
  const selectedLayers = useSelector(selectedLayersSelector);
  const onChangeHandler = (view: View) => setCurrentView(view);

  return (
    <div className={styles.globes}>
      <Globe
        active={isMainActive}
        view={currentView}
        onMouseEnter={() => setIsMainActive(true)}
        onChange={onChangeHandler}
      />

      {selectedLayers.compare && (
        <Globe
          active={!isMainActive}
          view={currentView}
          onMouseEnter={() => setIsMainActive(false)}
          onChange={onChangeHandler}
        />
      )}
    </div>
  );
};

export default Globes;
