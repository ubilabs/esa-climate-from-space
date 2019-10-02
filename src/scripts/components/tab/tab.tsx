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
  const btnClass = cx(styles.btn, {
    [styles.btnInactive]: activeTabId !== id
  });
  return (
    <button className={btnClass} onClick={() => onSelectTabId(id)}>
      {children}
    </button>
  );
};

export default Tab;
