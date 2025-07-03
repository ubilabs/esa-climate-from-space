import React, { createContext, useContext } from 'react';
import styles from './stories.module.css';

interface StoriesProps {
  children: React.ReactNode;
}

const StoriesContext = createContext({});

const StoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StoriesContext.Provider value={{}}>
      <div className={styles.stories}>{children}</div>
    </StoriesContext.Provider>
  );
};

export const useStories = () => useContext(StoriesContext);

const Stories: React.FC<StoriesProps> = ({ children }) => {
  return <StoriesProvider>{children}</StoriesProvider>;
};

export default Stories;

