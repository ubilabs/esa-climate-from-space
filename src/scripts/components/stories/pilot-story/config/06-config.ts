import giant01Graph from '../assets/giant01-graph.png';
import {SubStoryContent} from '../components/06-chapter/06-chapter';

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
