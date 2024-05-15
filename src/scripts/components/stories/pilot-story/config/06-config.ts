import giant01Graph from '../assets/giant01-graph.png';
import {GiantContent} from '../components/06-chapter/06-chapter';
import {TextPageContent} from '../components/chapter-text/chapter-text';

const giant01TextSections: TextPageContent[] = [
  {
    title: 'Incident Introduction',
    text: 'The Karaturun East Blowout of 2023 was a significant methane leak incident that occurred in a gas field located in Turkmenistan.',
    speed: 50,
    translate: [100, 10]
  },
  {
    title: 'Methane Release',
    text: 'It resulted from a blowout during gas extraction operations, leading to a substantial release of methane into the atmosphere.',
    speed: 100,
    translate: [100, 10]
  }
];
// placeholder
const giant02TextSections: TextPageContent[] = [
  {
    title: 'Lorem Ipsum',
    text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit, aliquid cum, vero non est minima rerum accusantium placeat quisquam eum quas vel, consequatur facilis alias blanditiis facere! Vel, fugit earum.',
    speed: 50,
    translate: [100, 10]
  },
  {
    title: 'Lorem Ipsum',
    text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit, aliquid cum, vero non est minima rerum accusantium placeat quisquam eum quas vel, consequatur facilis alias blanditiis facere! Vel, fugit earum.',
    speed: 100,
    translate: [100, 10]
  }
];

export const giantsStory: GiantContent[] = [
  {
    id: '01',
    subTitle: 'Methane Giant 01',
    title: 'Karaturun East Blowout 2023',
    textSections: giant01TextSections,
    videoPage: {
      title: 'Invisible for human eyes, but visible for infrared cam',
      text: 'This video show metane gase leaking during extraction operation',
      videoId: 'TDsbPkms6P4',
      caption:
        'Quantification of methane emissions and fire intensity from the Karaturun East 2023 blowout. Time series of methane emission rates (in metric tonnes per hour, t/h) derived from the satellite observations which passed the quality screening.'
    },
    textSectionShort: [
      {
        title: 'Detection Methods',
        text: 'Satellite surveillance and ground-based monitoring were employed to detect the blowout and quantify methane emissions.'
      }
    ],
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
    textSections: giant02TextSections,
    videoPage: {
      title: 'Lorem Ipsum',
      text: 'Lorem Ipsum',
      videoId: 'TDsbPkms6P4',
      caption:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit, aliquid cum, vero non est minima rerum accusantium placeat quisquam eum quas vel, consequatur facilis alias blanditiis facere! Vel, fugit earum.'
    },
    textSectionShort: [
      {
        title: 'Lorem Ipsum',
        text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit, aliquid cum, vero non est minima rerum accusantium placeat quisquam eum quas vel, consequatur facilis alias blanditiis facere! Vel, fugit earum.'
      }
    ],
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
