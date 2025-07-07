import { FunctionComponent } from "react";
import { FormatParallexLayout } from "../../../../../layout/block-format-layout/block-format-section";
import { ParallaxObject } from "../../../../../layout/parallax-object/parallax-object";

const TimeBlend: FunctionComponent = () => {
  return (
    <FormatParallexLayout>
      <h1>Time Blend Component</h1>
      <p>This is some dummy content for the Time Blend component.</p>
      <ul>
        <li>Dummy Point 1</li>
        <ParallaxObject speed={-10}>
          <li>Dummy Point 2</li>
        </ParallaxObject>
        <ParallaxObject speed={2}>
          <li>Dummy Point 3</li>
        </ParallaxObject>
        <ParallaxObject speed={-5}>
          <li>Dummy Point 4</li>
        </ParallaxObject>
        <li>Dummy Point 5</li>
      </ul>
    </FormatParallexLayout>
  );
};

export default TimeBlend;
