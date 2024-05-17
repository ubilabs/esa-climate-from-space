import giant01Graph from '../assets/06-giant01-graph.png';
import {SubStoryContent} from '../components/06-chapter/06-chapter';
import emmisionsGraph from '../assets/07-emissions-graph.png';
import {LegendItems} from '../components/legend/legend';

// chapter 2

export const legendItems02: LegendItems[] = [
  {name: 'Anthrophogenic', color: 'rgba(232, 119, 34, 1)'},
  {name: 'Natural', color: 'rgba(0, 179, 152, 1)'},
  {
    name: 'Anthrophogenic and Natural',
    color:
      'linear-gradient(45deg, rgba(0, 179, 152, 1) 25%, rgba(232, 119, 34, 1) 25%, rgba(232, 119, 34, 1) 50%, rgba(0, 179, 152, 1) 50%, rgba(0, 179, 152, 1) 75%, rgba(232, 119, 34, 1) 75%)'
  }
];

// chapter 6

export const legendItems06: LegendItems[] = [
  {name: 'Fosil Fuel CO2', color: '#DB3628'},
  {name: 'Methane', color: '#E58719'},
  {name: 'Other gases', color: '#7F6810'},
  {name: 'warming by 2.0', color: '#007D8A'},
  {name: 'warming by 1.5', color: '#00A3E0'}
];

export const graphContent = {
  title: 'Methane is a major contributor to global warming after CO2.',
  src: emmisionsGraph,
  alt: 'Contributions to global warming',
  legendItems: legendItems06
};

// chapter 7

export const subStory: SubStoryContent[] = [
  {
    id: '01',
    subTitle: 'Methane Giant 01',
    title: 'Karaturun East Blowout 2023',
    textPage1: {
      title: 'Incident Introduction',
      text: 'The Karaturun East Blowout of 2023 was a significant methane leak incident that occurred in a gas field located in Turkmenistan.'
    },
    textPage2: {
      title: 'Methane Release',
      text: 'It resulted from a blowout during gas extraction operations, leading to a substantial release of methane into the atmosphere.'
    },
    videoPage: {
      title: 'Invisible for human eyes, but visible for infrared cam',
      text: 'This video show metane gase leaking during extraction operation',
      videoId: 'TDsbPkms6P4',
      caption:
        'Quantification of methane emissions and fire intensity from the Karaturun East 2023 blowout. Time series of methane emission rates (in metric tonnes per hour, t/h) derived from the satellite observations which passed the quality screening.'
    },
    textPage3: {
      title: 'Detection Methods',
      text: 'Satellite surveillance and ground-based monitoring were employed to detect the blowout and quantify methane emissions.'
    },
    graphPage: {
      title:
        'Quantification and Time Series Analysis of Methane Emissions with satelites data',
      src: giant01Graph,
      alt: 'Giant 01 graph',
      caption:
        'The black line and the shaded area represent the polynomial fit that has been integrated for the calculation of the total amount of methane released during the event. The black bars depict all satellite observations from which a plume could be detected, including those that could not be quantified.'
    },
    conclusion:
      'The incident underscored the need for enhanced monitoring and regulatory oversight to prevent similar accidents and reduce methane emissions from industrial activities.'
  },
  // placeholder content
  {
    id: '02',
    subTitle: 'Methane Giant 02',
    title: 'Lorem Ipsum',
    textPage1: {
      title: 'Lorem Ipsum',
      text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit, aliquid cum, vero non est minima rerum accusantium placeat quisquam eum quas vel, consequatur facilis alias blanditiis facere! Vel, fugit earum.'
    },
    textPage2: {
      title: 'Lorem Ipsum',
      text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit, aliquid cum, vero non est minima rerum accusantium placeat quisquam eum quas vel, consequatur facilis alias blanditiis facere! Vel, fugit earum.'
    },
    videoPage: {
      title: 'Lorem Ipsum',
      text: 'Lorem Ipsum',
      videoId: 'TDsbPkms6P4',
      caption:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit, aliquid cum, vero non est minima rerum accusantium placeat quisquam eum quas vel, consequatur facilis alias blanditiis facere! Vel, fugit earum.'
    },
    textPage3: {
      title: 'Lorem Ipsum',
      text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit, aliquid cum, vero non est minima rerum accusantium placeat quisquam eum quas vel, consequatur facilis alias blanditiis facere! Vel, fugit earum.'
    },
    graphPage: {
      title: 'Lorem Ipsum',
      src: giant01Graph,
      alt: 'Giant 02 graph',
      caption:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit, aliquid cum, vero non est minima rerum accusantium placeat quisquam eum quas vel, consequatur facilis alias blanditiis facere! Vel, fugit earum.'
    },
    conclusion: 'Lorem Ipsum.'
  }
];

// all chapters

export const chapters = [
  {title: 'The invisible threat', subtitle: '01: What is methane'},
  {title: 'Where does methane come from?', subtitle: '02: Methane sources'},
  {
    title: 'ESA`s Watchful EyesOver Earth',
    subtitle: "03: ESA's Eyes in the Sky"
  },
  {title: 'Resolution Matters', subtitle: '04: Mapping the Methane Giants'},
  {
    title: 'Unveiling Methane Super Emitters',
    subtitle: '05: Mapping the Methane Giants'
  },
  {
    title: '10 largest methane leaks on record',
    subtitle: '06: Mapping the Methane Giants'
  },
  {
    title: 'Strategic choices for our future',
    subtitle: '07: Methane Reduction Urgency'
  }
];

// globe movements

export const globeMovementsPerChapter = {
  1: [
    {x: 30, y: 0, z: 0},
    {x: 0, y: 0, z: 30},
    {x: 0, y: 0, z: 20},
    {x: 0, y: 40, z: -60}
  ],
  2: [
    {x: 0, y: 0, z: 0},
    {x: 0, y: 5, z: 0},
    {x: 0, y: 5, z: 0},
    {x: 0, y: 5, z: 0},
    {x: 0, y: 5, z: 0},
    {x: 0, y: -60, z: 30},
    {x: 100, y: 0, z: -45}
  ],
  3: [
    {x: 0, y: 0, z: 0},
    {x: 10, y: 0, z: 0},
    {x: 10, y: 0, z: 0},
    {x: 10, y: 0, z: 0},
    {x: 10, y: 0, z: 0},
    {x: -140, y: 0, z: 15}
  ],
  4: [
    {x: 0, y: 0, z: 0},
    {x: 0, y: 0, z: 0},
    {x: 0, y: 0, z: 60},
    {x: 70, y: 0, z: -65}
  ],
  5: [
    {x: 0, y: 0, z: 0},
    {x: 5, y: 0, z: 0},
    {x: 5, y: 0, z: 0},
    {x: 5, y: 0, z: 0},
    {x: -85, y: 0, z: 40},
    {x: 0, y: 0, z: -30}
  ],
  6: [
    {x: 0, y: 0, z: 0},
    {x: 0, y: -10, z: 5},
    {x: 0, y: 20, z: -35},
    {x: 0, y: 0, z: -5},
    {x: 0, y: -40, z: 20},
    {x: 0, y: 0, z: 0},
    {x: 0, y: 0, z: 0},
    {x: 0, y: 0, z: 0},
    {x: 0, y: 20, z: -20},
    {x: 0, y: 80, z: 20}
  ],
  7: [{x: 0, y: 0, z: 0}]
};
export const globeMovements = [
  // chapter 1
  {
    pageFrom: 1,
    pageTo: 2,
    moveBy: {x: 30, y: 0, z: 0}
  },
  {
    pageFrom: 2,
    pageTo: 3,
    moveBy: {x: 0, y: 0, z: 30}
  },
  {
    pageFrom: 3,
    pageTo: 4,
    moveBy: {x: 0, y: 0, z: 10}
  },
  // chapter 2
  {
    pageFrom: 4,
    pageTo: 5,
    moveBy: {x: 0, y: 40, z: -50}
  },
  {
    pageFrom: 5,
    pageTo: 6,
    moveBy: {x: 0, y: 5, z: 0}
  },
  {
    pageFrom: 6,
    pageTo: 7,
    moveBy: {x: 0, y: 5, z: 0}
  },
  {
    pageFrom: 7,
    pageTo: 8,
    moveBy: {x: 0, y: 5, z: 0}
  },
  {
    pageFrom: 8,
    pageTo: 9,
    moveBy: {x: 0, y: 5, z: 0}
  },
  {
    pageFrom: 9,
    pageTo: 10,
    moveBy: {x: 0, y: -62, z: 50}
  },
  {
    pageFrom: 10,
    pageTo: 11,
    moveBy: {x: 0, y: 0, z: -40}
  },
  // chapter 3
  {
    pageFrom: 11,
    pageTo: 12,
    moveBy: {x: 80, y: 0, z: -15}
  },
  {
    pageFrom: 12,
    pageTo: 13,
    moveBy: {x: 5, y: 0, z: 0}
  },
  {
    pageFrom: 13,
    pageTo: 14,
    moveBy: {x: 5, y: 0, z: 0}
  },
  {
    pageFrom: 14,
    pageTo: 15,
    moveBy: {x: 5, y: 0, z: 0}
  },
  {
    pageFrom: 15,
    pageTo: 16,
    moveBy: {x: 30, y: 0, z: -7}
  },
  {
    pageFrom: 16,
    pageTo: 17,
    moveBy: {x: -10, y: 0, z: 1}
  },
  {
    pageFrom: 17,
    pageTo: 18,
    moveBy: {x: -40, y: 0, z: 5}
  },
  // chapter 4
  {
    pageFrom: 18,
    pageTo: 19,
    moveBy: {x: -75, y: 0, z: 15}
  },
  {
    pageFrom: 19,
    pageTo: 20,
    moveBy: {x: 0, y: 0, z: 15}
  },
  {
    pageFrom: 20,
    pageTo: 21,
    moveBy: {x: 0, y: 0, z: 100}
  },
  {
    pageFrom: 21,
    pageTo: 22,
    moveBy: {x: 20, y: 0, z: -100}
  },
  // chapter 5
  {
    pageFrom: 22,
    pageTo: 23,
    moveBy: {x: 30, y: 0, z: -15}
  },
  {
    pageFrom: 23,
    pageTo: 24,
    moveBy: {x: 5, y: 0, z: 0}
  },
  {
    pageFrom: 24,
    pageTo: 25,
    moveBy: {x: 5, y: 0, z: 0}
  },
  {
    pageFrom: 25,
    pageTo: 26,
    moveBy: {x: 5, y: 0, z: 0}
  },
  {
    pageFrom: 26,
    pageTo: 27,
    moveBy: {x: -65, y: 0, z: 40}
  },
  // chapter 6
  {
    pageFrom: 27,
    pageTo: 28,
    moveBy: {x: 0, y: 0, z: -40}
  },
  {
    pageFrom: 28,
    pageTo: 29,
    moveBy: {x: 0, y: -10, z: -15}
  },
  {
    pageFrom: 29,
    pageTo: 30,
    moveBy: {x: 0, y: 15, z: -10}
  },
  {
    pageFrom: 30,
    pageTo: 31,
    moveBy: {x: 0, y: -5, z: -5}
  },
  {
    pageFrom: 31,
    pageTo: 32,
    moveBy: {x: 0, y: 0, z: 0}
  }
];

// Used to determine if the chapter-intro is in view
export const introChapterId = 'chapter-intro';
