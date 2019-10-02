import React, {FunctionComponent} from 'react';
import Tab from '../tab/tab';
import styles from './tabs.styl';

interface Tab {
  id: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  activeTabId: string;
  onTabChanged: (name: string) => void;
}

const Tabs: FunctionComponent<Props> = ({tabs, activeTabId, onTabChanged}) => (
  <div className={styles.tabsContainer}>
    {tabs.map(tab => (
      <Tab
        key={tab.id}
        id={tab.id}
        activeTabId={activeTabId}
        onSelectTabId={id => onTabChanged(id)}>
        {tab.label}
      </Tab>
    ))}
  </div>
);

export default Tabs;
