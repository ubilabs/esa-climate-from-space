import React, {FunctionComponent} from 'react';
import {useParams} from 'react-router-dom';
import cx from 'classnames';

import styles from './tab.styl';

interface Props {
  id: string;
  label: string;
  activeTabId: string;
  onSelectTabId: (id: string) => void;
}

const Tab: FunctionComponent<Props> = ({
  id,
  label,
  activeTabId,
  onSelectTabId,
  children
}) => {
  const {mainLayerId} = useParams();
  const isActive = activeTabId === id;
  const tabClasses = cx(
    styles.tab,
    isActive && styles.tabActive,
    !mainLayerId && styles.disabled
  );

  return (
    <button
      title={label}
      className={tabClasses}
      onClick={() => onSelectTabId(id)}>
      {children}
    </button>
  );
};

export default Tab;
