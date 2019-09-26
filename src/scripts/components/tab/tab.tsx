import React, {FunctionComponent} from 'react';
import {tabName} from '../../actions/set-active-tab';
import styles from './tab.styl';
import classNames from 'classnames';

interface Props {
  name: tabName;
  activeTab: tabName;
  selectTab: (name: tabName) => void;
}

const Tab: FunctionComponent<Props> = props => {
  const {name, activeTab, selectTab} = props;
  const btnClass = classNames({
    [styles.btn]: true,
    [styles.btnInactive]: activeTab !== name
  });
  return (
    <button className={btnClass} onClick={() => selectTab(name)}>
      {props.children}
    </button>
  );
};

export default Tab;
