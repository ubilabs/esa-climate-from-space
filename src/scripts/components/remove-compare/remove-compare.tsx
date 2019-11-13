import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';
import {useIntl} from 'react-intl';

import setSelectedLayerIdsAction from '../../actions/set-selected-layer-ids';
import {RemoveIcon} from '../icons/remove-icon';

import styles from './remove-compare.styl';

const RemoveCompare: FunctionComponent = () => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const onButtonClick = () => {
    dispatch(setSelectedLayerIdsAction(null, false));
  };

  return (
    <div className={styles.removeCompare}>
      <button
        className={styles.icon}
        title={intl.formatMessage({id: 'remove-compare'})}
        onClick={onButtonClick}>
        <RemoveIcon />
      </button>
    </div>
  );
};

export default RemoveCompare;
