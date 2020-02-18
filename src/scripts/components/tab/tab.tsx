import React, {FunctionComponent} from 'react';
import cx from 'classnames';

import styles from './tab.styl';

interface Props {
  id: string;
  label: string;
  activeTabId: string;
  disabled: boolean;
  onSelectTabId: (id: string) => void;
}

const Tab: FunctionComponent<Props> = ({
  id,
  label,
  activeTabId,
  disabled,
  onSelectTabId,
  children
}) => {
  const isActive = activeTabId === id;
  const tabClasses = cx(
    styles.tab,
    isActive && styles.tabActive,
    disabled && styles.disabled
  );

  return (
    <button
      title={label}
      className={tabClasses}
      onClick={() => !disabled && onSelectTabId(id)}>
      {children}
    </button>
  );
};

export default Tab;
