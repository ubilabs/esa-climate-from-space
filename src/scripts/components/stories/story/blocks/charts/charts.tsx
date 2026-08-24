import { FunctionComponent, ReactNode } from "react";

import StoryChart from "./modules/story-chart/story-chart";

import styles from "./charts.module.css";

export type ChartsCompoundComponents = {
  StoryChart: typeof StoryChart;
};

export const Charts = (({ children }: { children: ReactNode }) => {
  return <article className={styles.charts}>{children}</article>;
}) as FunctionComponent<{ children: ReactNode }> & ChartsCompoundComponents;

Charts.StoryChart = StoryChart;
