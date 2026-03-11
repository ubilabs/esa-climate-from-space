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
      input: [0, 0.025, 0.05, 0.1, 0.6, 1],
      output: [0.01, 0.05, 0.1, 1, 1, 0.01],
    },
    yPosition: {
      input: [0, 0.1],
      output: ["20%", "0%"],
    },
    opacity: {
      input: [0, 0.88, 1],
      output: [1, 1, 0],
    },
    bulbOpacity: {
      input: [0, 0.035, 0.045, 0.06],
      output: [0, 0, 0.8, 1],
    },
  },
  bulbExit: {
    input: [0.05, 0.1],
    output: ["0vh", "-100vh"],
  },
  squareMeterScale: {
    input: [0.1, 0.15],
    output: ["8", "1"],
  },
  satellite: {
    xPosition: {
      input: [0, 0.8, 1],
      output: ["-50vw", "50vw", "200vw"],
    },
    opacity: {
      input: [0, 0.13, 0.15, 0.7, 0.9],
      output: ["0", "0", "1", "1", "0"],
    },
  },
  kettleRows: {
    rangeStart: 0.25,
    rangeEnd: 0.65,
    fadeIn: {
      input: [0.15, 0.165],
      output: [0, 1],
    },
  },
  yearSlider: {
    fadeIn: {
      input: [0.15, 0.165, 0.5, 0.75],
      output: ["0", "1", "1", "0"],
    },
    slide: {
      input: [0, 0.27, 0.32],
      output: ["-46%", "-46%", "0%"],
    },
  },
  scrollText: {
    input: [0, 0.7, 0.75, 0.85, 1],
    output: ["100%", "100%", "30%", "30%", "-100%"],
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
      inputRange: [0.33, 0.35, 0.38, 0.4],
      text: intl.formatMessage({ id: "story.eei.kettle.overlay1" }),
    },
    {
      inputRange: [0.4, 0.42, 0.48, 0.5],
      text: intl.formatMessage({ id: "story.eei.kettle.overlay2" }),
    },
    {
      inputRange: [0.5, 0.55, 0.59, 0.62],
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
