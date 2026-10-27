import { FunctionComponent } from "react";

import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import { MediaSlideContainer } from "../../../../../layout/media-slide-container/media-slide-container";
import {
  ImageModule,
  StorySectionProps,
} from "../../../../../../../types/story";
import { ScrollImage } from "./image-scroll-image/image-scroll-image";
import InViewVideo from "../shared/in-view-video/in-view-video";
import { getStoryAssetUrl } from "../../../../../../../libs/get-story-asset-urls";
import { isVideo } from "../../../../../../../libs/is-video";

const ImageScroll: FunctionComponent<StorySectionProps> = () => {
  const {
    module: { slides },
    storyId,
    getRefCallback,
  } = useModuleContent<ImageModule>();
  return (
    <div>
      {slides?.map(
        // Set leading as default so image appears on the left / on top
        ({ url, text, altText, caption, focus, leading = true }, index) => (
          <MediaSlideContainer
            ref={getRefCallback?.(index, 0)}
            key={url || index}
            leading={leading}
            text={text}
            caption={caption}
            storyId={storyId}
          >
            {isVideo(url) ? (
              <InViewVideo src={getStoryAssetUrl(storyId, url)} />
            ) : (
              <ScrollImage
                focus={focus}
                src={getStoryAssetUrl(storyId, url)}
                alt={altText || text}
              />
            )}
          </MediaSlideContainer>
        ),
      )}
    </div>
  );
};

export default ImageScroll;
