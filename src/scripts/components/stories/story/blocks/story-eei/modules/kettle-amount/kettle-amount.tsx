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
      input: [0, 0.04, 0.05, 0.17, 0.3, 0.9, 1],
      output: [0.01, 0.01, 0.4, 0.4, 1, 1, 0.01],
    },
    yPosition: {
      input: [0, 0.04, 0.16, 0.2],
      output: ["-40%", "60%", "60%", "0%"],
    },
    opacity: {
      input: [0, 0.88, 1],
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
    input: [0.15, 0.45, 0.5],
    output: ["8", "8", "1"],
  },
  satellite: {
    xPosition: {
      input: [0, 0.5, 0.8, 1],
      output: ["-100vw", "-50vw", "50vw", "200vw"],
    },
    opacity: {
      input: [0, 0.4, 0.45, 0.7, 0.9],
      output: ["0", "0", "1", "1", "0"],
    },
  },
  kettleRows: {
    entryRangeStart: 0.45,
    entryRangeEnd: 0.55,
    exitRangeStart: 0.7,
    exitRangeEnd: 0.84,
  },
  yearSlider: {
    fadeIn: {
      input: [0.4, 0.5, 0.7, 0.75],
      output: ["0", "1", "1", "0"],
    },
    slide: {
      input: [0, 0.7, 0.8],
      output: ["-46%", "-46%", "0%"],
    },
  },
  scrollText: {
    input: [0, 0.9, 0.92, 0.96, 1],
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
      inputRange: [0.5, 0.54, 0.58, 0.6],
      text: intl.formatMessage({ id: "story.eei.kettle.overlay1" }),
    },
    {
      inputRange: [0.6, 0.62, 0.66, 0.7],
      text: intl.formatMessage({ id: "story.eei.kettle.overlay2" }),
    },
    {
      inputRange: [0.8, 0.82, 0.86, 0.9],
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
          text="That square metre is now trapping much more heat."
          inputRange={animationConfig.scrollText.input}
          outputRange={animationConfig.scrollText.output}
        />
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
