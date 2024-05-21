import React, {CSSProperties, FunctionComponent} from 'react';
import {Parallax} from 'react-scroll-parallax';

import styles from './legend.module.styl';

export interface LegendItems {
  name: string;
  color: string;
}

interface Props {
  title: string;
  legendItems?: LegendItems[];
}

const Legend: FunctionComponent<Props> = ({title, legendItems}) => (
  <Parallax className={styles.legend} speed={10} easing="easeInQuad">
    <h1>{title}</h1>
    <legend>
      {legendItems &&
        legendItems.map(({name, color}, index) => (
          <span key={index} style={{'--legend-color': color} as CSSProperties}>
            {name}
          </span>
        ))}
    </legend>
  </Parallax>
);

export default Legend;
