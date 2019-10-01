import React, {FunctionComponent} from 'react';
import styles from './tab.styl';
import classNames from 'classnames';

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
  const btnClass = classNames(styles.btn, {
    [styles.btnInactive]: activeTabId !== id
  });
  return (
    <button className={btnClass} onClick={() => onSelectTabId(id)}>
      {children}
    </button>
  );
};

export default Tab;
