import React, {FunctionComponent} from 'react';
import {useHistory} from 'react-router-dom';
import {Parallax} from 'react-scroll-parallax';

import {useScreenSize} from '../../../../../hooks/use-screen-size';
import {useThunkDispatch} from '../../../../../hooks/use-thunk-dispatch';
import setSelectedLayerIdsAction from '../../../../../actions/set-selected-layer-id';

import ScrollHint from '../scroll-hint/scroll-hint';
import Button from '../button/button';

import styles from './explore-dataset.module.styl';
import SnapWrapper from '../snap-wrapper/snap-wrapper';

interface Props {
  title: string;
  dataLayerId: string;
}

const ExploreDataset: FunctionComponent<Props> = ({title, dataLayerId}) => {
  const {isMobile} = useScreenSize();
  const history = useHistory();
  const dispatch = useThunkDispatch();

  return (
    <SnapWrapper>
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
          {isMobile && <ScrollHint />}
        </div>
      </Parallax>
    </SnapWrapper>
  );
};

export default ExploreDataset;
