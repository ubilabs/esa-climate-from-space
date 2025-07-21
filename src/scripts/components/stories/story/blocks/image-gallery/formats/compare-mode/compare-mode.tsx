import { FunctionComponent } from "react";
import { useFormat } from "../../../../../../../providers/story/format/use-format";
import { FormatContainer } from "../../../../../layout/format-container/format-container";
import { StorySectionProps } from "../../../../../../../types/story";
import { getStoryAssetUrl } from "../../../../../../../libs/get-story-asset-urls";
import styles from "./compare-mode.module.css";
import { CompareImages } from "./compare-images/compare-images";

const CompareMode: FunctionComponent<StorySectionProps> = ({ ref }) => {
  const { content, storyId } = useFormat();
  const { slides } = content;
  console.log("CompareMode content:", content);

  if (!slides || slides.length < 2) {
    console.warn("CompareMode requires at least two images to compare.");
    return null;
  }

  const image1 = slides[0];
  const image2 = slides[1];

  return (
    <FormatContainer ref={ref} className={styles.compareModeBlock}>
      <CompareImages
        src1={getStoryAssetUrl(storyId, image1.url)}
        alt1={image1.caption || image1.altText}
        src2={getStoryAssetUrl(storyId, image2.url)}
        alt2={image2.caption || image2.altText}
      />
      <div className={styles.captions}>
        <div>
          <h3>{image1.caption}</h3>
          <p>{image1.altText}</p>
        </div>
        <div>
          <h3>{image2.caption}</h3>
          <p>{image2.altText}</p>
        </div>
      </div>
    </FormatContainer>
  );
};

export default CompareMode;
