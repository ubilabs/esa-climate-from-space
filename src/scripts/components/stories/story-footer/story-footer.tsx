import { FunctionComponent } from "react";
import cx from "classnames";

import StoryPagination from "../story-pagination/story-pagination";
import Autoplay from "../autoplay/autoplay";
import { useStoryNavigation } from "../../../hooks/use-story-navigation";
import { useMouseMove } from "../../../hooks/use-mouse-move";

import { Story } from "../../../types/story";

import styles from "./story-footer.module.css";
import { useAppRouteFlags } from "../../../hooks/use-app-route-flags";

interface Props {
  slideIndex: number;
  selectedStory: Story | null;
  videoDuration: number;
}

const StoryFooter: FunctionComponent<Props> = ({
  slideIndex,
  selectedStory,
  videoDuration,
}) => {

  const {isShowCaseView, isPresentView} = useAppRouteFlags();

  const { nextSlideLink, previousSlideLink, autoPlayLink, delay } =
    useStoryNavigation(videoDuration);
  // console.log("nextSlideLink", nextSlideLink);

  const mouseMove = useMouseMove();
  const footerClasses = cx(
    styles.storyFooter,
    (isShowCaseView || isPresentView) && !mouseMove && styles.slideOutFooter,
  );

  return (
    <div className={footerClasses}>
      {selectedStory && (
        <StoryPagination
          slideIndex={slideIndex}
          storySlidesLength={selectedStory.slides.length}
          nextSlideLink={nextSlideLink}
          previousSlideLink={previousSlideLink}
        />
      )}
      {isShowCaseView && autoPlayLink && delay && (
        <Autoplay delay={delay} autoPlayLink={autoPlayLink} />
      )}
    </div>
  );
};

export default StoryFooter;
