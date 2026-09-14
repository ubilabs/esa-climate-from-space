import { FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";
import cx from "classnames";

import styles from "./caption.module.css";

interface Props {
  content: string;
  showLightbox: boolean;
  position?: "absolute" | "static" | "relative";
}

const Caption: FunctionComponent<Props> = ({
  content,
  showLightbox,
  position,
}) => {
  const classes = cx(styles.caption, showLightbox && styles.lightboxCaption);

  return (
    <div
      className={classes}
      style={{
        position,
      }}
    >
      <div className={styles.content}>
        <ReactMarkdown
          children={content}
          allowedElements={["h1", "h2", "h3", "p", "span", "br", "b", "em"]}
        />
      </div>
    </div>
  );
};

export default Caption;
