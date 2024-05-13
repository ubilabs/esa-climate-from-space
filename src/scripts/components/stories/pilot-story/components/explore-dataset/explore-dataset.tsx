import React, {FunctionComponent} from 'react';
import {useHistory} from 'react-router-dom';
import {Parallax} from 'react-scroll-parallax';
import {useThunkDispatch} from '../../../../../hooks/use-thunk-dispatch';

import setSelectedLayerIdsAction from '../../../../../actions/set-selected-layer-id';

import ScrollHint from '../scroll-hint/scroll-hint';
import Button from '../button/button';

import styles from './explore-dataset.module.styl';

const ExploreDataset: FunctionComponent = () => {
  const history = useHistory();
  const dispatch = useThunkDispatch();

  return (
    <section className={styles.explore}>
      <Parallax className={styles.exploreContent}>
        <h1>
          Explore the world of methane super emitters – key players in climate
          change.
        </h1>

        <div className={styles.buttonContainer}>
          <Button
            label="Explore Dataset"
            onClick={() => {
              dispatch(setSelectedLayerIdsAction('greenhouse.xch4', true));
              history.push('/');
            }}
          />
          <ScrollHint />
        </div>
      </Parallax>
    </section>
  );
};

export default ExploreDataset;
