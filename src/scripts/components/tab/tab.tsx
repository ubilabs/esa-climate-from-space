import React, {FunctionComponent} from 'react';
import cx from 'classnames';

import styles from './tab.styl';

interface Props {
  id: string;
  activeTabId: string;
  onSelectTabId: (id: string) => void;
}

const Tab: FunctionComponent<Props> = ({
  id,
  activeTabId,
  onSelectTabId,
  children
}) => {
  const isActive = activeTabId === id;
  const tabClasses = cx(styles.tab, isActive && styles.tabActive);

  return (
    <button className={tabClasses} onClick={() => onSelectTabId(id)}>
      {children}
    </button>
  );
};

export default Tab;
