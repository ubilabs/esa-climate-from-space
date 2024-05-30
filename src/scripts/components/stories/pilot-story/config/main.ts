import giant01Graph from '../assets/06-giant01-graph.png';
import giant01Legend from '../assets/06-giant01-legend.png';
import {SubStoryContent} from '../components/06-chapter/06-chapter';
import emmisionsGraph from '../assets/07-emissions-graph.png';
import {LegendItems} from '../components/legend/legend';
import {LayerProps} from '@ubilabs/esa-webgl-globe';

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
  legendItems: legendItems06,
  speed: -15
};

// chapter 6

export const subStory: SubStoryContent[] = [
  {
    id: '01',
    subTitle: 'Methane Giant 01',
    title: 'Karaturun East Blowout 2023',
    location: {lat: 43.6992455, lng: 51.2108465},
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
      legendSrc: giant01Legend,
      legendAlt: 'Giant 01 legend',
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
    location: {lat: 62.3537376, lng: 37.3014177},
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
  {title: '01: The invisible threat', subtitle: '01: What is methane'},
  {title: '02: Where does methane come from?', subtitle: '02: Methane sources'},
  {
    title: '03: ESA`s Watchful EyesOver Earth',
    subtitle: "03: ESA's Eyes in the Sky"
  },
  {title: '04: Resolution Matters', subtitle: '04: Mapping the Methane Giants'},
  {
    title: '05: Unveiling Methane Super Emitters',
    subtitle: '05: Mapping the Methane Giants'
  },
  {
    title: '06: 10 largest methane leaks on record',
    subtitle: '06: Mapping the Methane Giants'
  },
  {
    title: '07: Strategic choices for our future',
    subtitle: '07: Methane Reduction Urgency'
  },
  {
    title: 'The end',
    subtitle: 'Read more stories'
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
    {x: 0, y: -60, z: 35},
    {x: 100, y: 0, z: -50}
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
    {x: 0, y: 0, z: -5},
    {x: 0, y: 10, z: -25},
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

// globe movements desktop

export const globeMovementsPerChapterDesktop = {
  1: [
    {x: -10, y: 0, z: -30},
    {x: 40, y: 0, z: -5},
    {x: -25, y: 0, z: 90},
    {x: -15, y: 5, z: -85}
  ],
  2: [
    {x: 0, y: 0, z: 0},
    {x: 10, y: 0, z: 0},
    {x: 30, y: 0, z: 0},
    {x: 0, y: 0, z: 10},
    {x: 0, y: 60, z: -5},
    {x: 0, y: -65, z: 35},
    {x: 50, y: 0, z: -40}
  ],
  3: [
    {x: 0, y: 0, z: 0},
    {x: 0, y: 0, z: 0},
    {x: 0, y: 0, z: 0},
    {x: 0, y: 0, z: 0},
    {x: 10, y: 0, z: 0},
    {x: -60, y: 0, z: -5},
    {x: -60, y: 0, z: -5}
  ],
  4: [
    {x: 0, y: 0, z: 0},
    {x: 20, y: 0, z: 10},
    {x: 15, y: 0, z: 80},
    {x: 0, y: 0, z: -50}
  ],
  5: [
    {x: 0, y: 0, z: 0},
    {x: 25, y: 0, z: -40},
    {x: 0, y: 0, z: 0},
    {x: 0, y: 0, z: 0},
    {x: 0, y: 0, z: 50},
    {x: -25, y: 0, z: -20}
  ],
  6: [
    {x: 0, y: 0, z: 0},
    {x: 25, y: 0, z: -15},
    {x: 0, y: 0, z: -10},
    {x: 0, y: 0, z: 0},
    {x: 0, y: -20, z: 20},
    {x: 0, y: 0, z: -10},
    {x: 0, y: 20, z: 0},
    {x: 0, y: 40, z: 0},
    {x: 0, y: 30, z: 0},
    {x: 35, y: -70, z: -5}
  ],
  7: [
    {x: 0, y: 0, z: 0},
    {x: -35, y: 0, z: 0},
    {x: 0, y: 0, z: 0},
    {x: 0, y: 0, z: 0},
    {x: 0, y: 0, z: 20},
    {x: 0, y: 0, z: 0}
  ]
};

// globe data layers

// Latest timestamp: December 2021
const timeIndex = 71;
// @ts-ignore - injected via webpack's define plugin
const version = INFO_VERSION;

export const GREY_BASE_MAP = {
  id: 'basemap',
  zIndex: 0,
  type: 'tile',
  maxZoom: 5,
  urlParameters: {},
  getUrl: ({x, y, zoom}) =>
    `https://storage.googleapis.com/esa-cfs-tiles/${version}/basemaps/land/${zoom}/${x}/${y}.png`
} as LayerProps;

export const COLORED_BASE_MAP = {
  id: 'basemap',
  zIndex: 0,
  type: 'tile',
  maxZoom: 5,
  urlParameters: {},
  getUrl: ({x, y, zoom}) =>
    `https://storage.googleapis.com/esa-cfs-tiles/${version}/basemaps/colored/${zoom}/${x}/${y}.png`
} as LayerProps;

export const GREENHOUSE_XCH4 = {
  id: 'greenhouse.xch4',
  zIndex: 1,
  type: 'tile',
  maxZoom: 5,
  urlParameters: {},
  getUrl: ({x, y, zoom}) =>
    `https://storage.googleapis.com/esa-cfs-tiles/${version}/greenhouse.xch4/tiles/${timeIndex}/${zoom}/${x}/${y}.png`
} as LayerProps;

export const SUPER_EMITTERS = {
  id: 'super_emitters',
  zIndex: 1,
  type: 'image',
  maxZoom: 0,
  urlParameters: {},
  getUrl: () =>
    `https://storage.googleapis.com/esa-cfs-tiles/${version}/super_emitters/tiles/0/full.png`
} as LayerProps;

// Used to determine if the chapter-intro is in view
export const chapterIntroElement = 'chapter-intro';

export const chapterMainElement = 'chapter-main';

export const progressIndicationElement = 'progress-indication';

export const dataIsTitleInView = 'data-is-title-in-view';

export const globeElement = 'globe';
