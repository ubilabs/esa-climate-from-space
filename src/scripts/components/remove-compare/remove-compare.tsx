import React, {FunctionComponent} from 'react';
import {useIntl} from 'react-intl';
import {Link} from 'react-router-dom';

import {RemoveIcon} from '../icons/remove-icon';

import styles from './remove-compare.styl';

const RemoveCompare: FunctionComponent = () => {
  const intl = useIntl();

  return (
    <div className={styles.removeCompare}>
      <Link to="/">
        <button
          className={styles.icon}
          title={intl.formatMessage({id: 'remove-compare'})}>
          <RemoveIcon />
        </button>
      </Link>
    </div>
  );
};

export default RemoveCompare;
