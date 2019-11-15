import React, {FunctionComponent} from 'react';
import {useIntl} from 'react-intl';
import {Link, matchPath, useLocation} from 'react-router-dom';

import {RemoveIcon} from '../icons/remove-icon';

import styles from './remove-compare.styl';

const RemoveCompare: FunctionComponent = () => {
  const intl = useIntl();
  const location = useLocation();
  const match = matchPath(location.pathname, {
    path: '(/|/layers)/:mainLayerId?/:compareLayerId?',
    exact: true
  });

  const params = match && match.params;
  const mainLayerId = (params && (params as any).mainLayerId) || '';
  const newPath = mainLayerId ? `/layers/${mainLayerId}` : '/';

  return (
    <div className={styles.removeCompare}>
      <Link to={newPath}>
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
