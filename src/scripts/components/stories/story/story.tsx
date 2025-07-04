import { FunctionComponent, RefObject } from "react";

import { ImageGallery } from "./blocks/image-gallery/image-gallery";
import { useContentParams } from "../../../hooks/use-content-params";
import { useGetStoryQuery } from "../../../services/api";

import styles from "./story.module.css";

const Story: FunctionComponent<{ ref: RefObject<HTMLDivElement | null> }> = ({
  ref,
}) => {
  const { currentStoryId } = useContentParams();

  const {data: selectedStory} = useGetStoryQuery({
    id: currentStoryId,
    language: "en",
  });
  console.log("Selected Story:", selectedStory);

  return (
    <main className={styles.story} ref={ref} id="story">
      <ImageGallery>
        <ImageGallery.CompareMode />
        <ImageGallery.TimeBlend />
        <ImageGallery.CompareMode />
      </ImageGallery>
    </main>
  );
};

export default Story;
