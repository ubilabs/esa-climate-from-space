import React, {FunctionComponent} from 'react';
import Tab from '../tab/tab';
import styles from './tabs.styl';

import {Tab as TabInterface} from '../../types/tab';

interface Props {
  tabs: TabInterface[];
  activeTabId: string;
  onTabChanged: (name: string) => void;
}

const Tabs: FunctionComponent<Props> = ({tabs, activeTabId, onTabChanged}) => (
  <div className={styles.tabsContainer}>
    {tabs.map(tab => {
      const Icon = tab.icon;

      return (
        <Tab
          key={tab.id}
          id={tab.id}
          disabled={tab.disabled}
          label={tab.label}
          activeTabId={activeTabId}
          onSelectTabId={id => onTabChanged(id)}>
          {Icon ? <Icon /> : tab.label}
          {tab.label}
        </Tab>
      );
    })}
  </div>
);

export default Tabs;
