import React, {FunctionComponent} from 'react';
import {useHistory} from 'react-router-dom';
import {Parallax} from 'react-scroll-parallax';
import {useThunkDispatch} from '../../../../../hooks/use-thunk-dispatch';

import setSelectedLayerIdsAction from '../../../../../actions/set-selected-layer-id';

import ScrollHint from '../scroll-hint/scroll-hint';
import Button from '../button/button';

import styles from './explore-dataset.module.styl';

interface Props {
  title: string;
  dataLayerId: string;
}

const ExploreDataset: FunctionComponent<Props> = ({title, dataLayerId}) => {
  const history = useHistory();
  const dispatch = useThunkDispatch();

  return (
    <section className={styles.explore}>
      <Parallax className={styles.exploreContent}>
        <h1>{title}</h1>

        <div className={styles.buttonContainer}>
          <Button
            label="Explore Dataset"
            onClick={() => {
              dispatch(setSelectedLayerIdsAction(dataLayerId, true));
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
