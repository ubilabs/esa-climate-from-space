import {ParallaxProps} from 'react-scroll-parallax';

export type GlobeMovement = {
  x: number;
  y: number;
  z: number;
};

export type ChapterNumber = number;

export type GlobeMovementsPerChapter = Record<ChapterNumber, GlobeMovement[]>;

export enum MethaneSources {
  LIVESTOCK = 'livestock',
  TRANSPORTATION = 'transportation',
  FACTORIES = 'factories',
  BURNING = 'burning',
  OIL = 'oil',
  LANDFILLS = 'landfills',
  CONSTRUCTION = 'construction'
}

export enum MethaneSourceType {
  ANTHROPHOGENIC = 'anthrophogenic',
  NATURAL = 'natural'
}

export const methaneSources = {
  [MethaneSources.TRANSPORTATION]: {
    label: 'Transportation',
    explanation:
      'Transportation is a major source of methane emissions. It is responsible for 16% of global methane emissions.',
    percentageOfTotalEmission: 16,
    type: MethaneSourceType.ANTHROPHOGENIC
  },
  [MethaneSources.FACTORIES]: {
    label: 'Factories',
    explanation:
      'Factories are a major source of methane emissions. They are responsible for 20% of global methane emissions.',
    percentageOfTotalEmission: 20,
    type: MethaneSourceType.ANTHROPHOGENIC
  },
  [MethaneSources.BURNING]: {
    label: 'Burning',
    explanation:
      'Burning is a major source of methane emissions. It is responsible for 10% of global methane emissions.',
    percentageOfTotalEmission: 10,
    type: MethaneSourceType.NATURAL
  },
  [MethaneSources.OIL]: {
    label: 'Oil',
    explanation:
      'Oil is a major source of methane emissions. It is responsible for 20% of global methane emissions.',
    percentageOfTotalEmission: 20,
    type: MethaneSourceType.NATURAL
  },
  [MethaneSources.LANDFILLS]: {
    label: 'Landfills',
    explanation:
      'Landfills are a major source of methane emissions. They are responsible for 20% of global methane emissions.',
    percentageOfTotalEmission: 20,
    type: MethaneSourceType.ANTHROPHOGENIC
  },
  [MethaneSources.CONSTRUCTION]: {
    label: 'Construction',
    explanation:
      'Construction is a major source of methane emissions. It is responsible for 10% of global methane emissions.',
    percentageOfTotalEmission: 10,
    type: MethaneSourceType.ANTHROPHOGENIC
  }
} as const;

export enum SatelliteNames {
  'SENTINEL-1' = 'SENTINEL-1',
  'SENTINEL-2' = 'SENTINEL-2',
  'SENTINEL-3' = 'SENTINEL-3'
}

export type ChapterSelectionHandler = ParallaxProps;

export enum ChapterPosition {
  INTRO = 'intro',
  CONTENT = 'content'
}
