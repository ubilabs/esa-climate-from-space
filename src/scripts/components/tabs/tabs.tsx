import React, {FunctionComponent} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Tab from '../tab/tab';
import styles from './tabs.styl';
import {setActiveTabSelector} from '../../reducers/active-tab';
import {setActiveTabAction} from '../../actions/set-active-tab';

const Tabs: FunctionComponent<{}> = () => {
  const activeTab = useSelector(setActiveTabSelector);
  const dispatch = useDispatch();

  return (
    <div className={styles.tabsContainer}>
      <Tab
        name="main"
        activeTab={activeTab}
        selectTab={name => dispatch(setActiveTabAction(name))}>
        Main
      </Tab>
      <Tab
        name="compare"
        activeTab={activeTab}
        selectTab={name => dispatch(setActiveTabAction(name))}>
        Compare
      </Tab>
    </div>
  );
};

export default Tabs;
