import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";
import ScrollModule from "../../../modules/base-scroll/module/scroll-module";

import ScrollText from "../../../modules/base-scroll/scroll-text/scroll-text";
import { StoryEEIModule } from "../../../../../../../types/story";

const animationConfig = {
  y: {
    input: [0, 1],
    output: ["10vh", "-10vh"],
  },
  fadeIn: {
    input: [0, 0.3, 0.7, 1],
    output: [0, 1, 1, 0.8],
  },
};

export type ScrollTextSlideAnimationConfig = typeof animationConfig;

export default function ScrollTextSlide() {
  const {
    module: { lengthFactor, content },
    getRefCallback,
  } = useModuleContent<Extract<StoryEEIModule, { type: "scrollTextSlide" }>>();

  return (
    <ScrollModule config={animationConfig} lengthFactor={lengthFactor}>
      <ScrollModule.StickyContainer isGrid ref={getRefCallback(0, 0)}>
        <ScrollText text={content.text} />
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
