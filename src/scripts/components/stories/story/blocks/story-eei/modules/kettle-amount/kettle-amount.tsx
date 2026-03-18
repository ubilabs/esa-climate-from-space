import { useIntl } from "react-intl";
import ScrollModule from "../base-scroll/module/scroll-module";
import BulbAnimation from "./bulb-animation/bulb-animation";
import KettleBox from "./kettle-box/kettle-box";
import KettleOverlay, {
  KettleOverlayProps,
} from "./kettle-overlay/kettle-overlay";

import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import ScrollText from "../base-scroll/scroll-text/scroll-text";

const animationConfig = {
  initial: {
    scale: {
      input: [0, 0.04, 0.05, 0.17, 0.3, 0.94, 1],
      output: [0.01, 0.01, 0.4, 0.4, 1, 1, 0.01],
    },
    yPosition: {
      input: [0, 0.04, 0.16, 0.2],
      output: ["-40px", "200px", "200px", "0px"],
    },
    opacity: {
      input: [0, 0.94, 1],
      output: [1, 1, 0],
    },
    bulbOpacity: {
      input: [0, 0.09, 0.12],
      output: [0, 0, 1],
    },
    text1: {
      input: [0, 0.065, 0.09],
      output: [1, 1, 0],
    },
    text2: {
      input: [0, 0.09, 0.12],
      output: [0, 0, 1],
    },
  },
  bulbExit: {
    input: [0.16, 0.2],
    output: ["0vh", "-100vh"],
  },
  squareMeterScale: {
    input: [0.15, 0.3, 0.5],
    output: ["6", "6", "1"],
  },
  satellite: {
    xPosition: {
      input: [0, 0.64, 0.7, 0.9, 0.92],
      output: ["-800%", "-400%", "-50%", "-50%", "500%"],
    },
    opacity: {
      input: [0, 0.32, 0.34, 0.94, 0.96],
      output: ["0", "0", "1", "1", "0"],
    },
  },
  kettleRows: {
    entryRangeStart: 0.35,
    entryRangeEnd: 0.55,
    exitRangeStart: 0.87,
    exitRangeEnd: 0.89,
    opacity: {
      input: [0, 0.89, 0.9],
      output: ["1", "1", "0"],
    },
  },
  yearSlider: {
    fadeIn: {
      input: [0, 0.4, 0.45, 0.89, 0.9],
      output: ["0", "0", "1", "1", "0"],
    },
    slide: {
      input: [0, 0.84, 0.87],
      output: ["-49%", "-49%", "37.5%"],
    },
  },
  scrollText: {
    input: [0, 0.91, 0.92, 0.99, 1],
    output: ["100%", "100%", "30%", "0%", "-100%"],
  },
};

export type KettleAmountAnimationConfig = typeof animationConfig;

export default function KettleAmountModule() {
  const intl = useIntl();

  const {
    module: { lengthFactor },
  } = useModuleContent();

  const overlays: Array<KettleOverlayProps> = [
    {
      inputRange: [0.55, 0.57, 0.62, 0.64],
      text: intl.formatMessage({ id: "story.eei.kettle.overlay1" }),
    },
    {
      inputRange: [0.7, 0.77, 0.82, 0.84],
      text: intl.formatMessage({ id: "story.eei.kettle.overlay2" }),
    },
    {
      inputRange: [0.85, 0.86, 0.88, 0.9],
      text: intl.formatMessage({ id: "story.eei.kettle.overlay3" }),
    },
  ];

  return (
    <ScrollModule config={animationConfig} lengthFactor={lengthFactor}>
      <ScrollModule.StickyContainer isGrid>
        <BulbAnimation />
        <KettleBox />
        {overlays.map((overlay, index) => (
          <KettleOverlay key={index} {...overlay} />
        ))}
        <ScrollText
          text="That square metre is now trapping three times as much heat"
          inputRange={animationConfig.scrollText.input}
          outputRange={animationConfig.scrollText.output}
        />
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
