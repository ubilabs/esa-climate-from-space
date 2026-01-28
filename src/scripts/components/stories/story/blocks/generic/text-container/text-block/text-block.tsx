import { FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";
import cx from "classnames";

import config from "../../../../../../../config/main";

import styles from "./text-block.module.css";

interface Props {
  text: string;
  refProp?: React.Ref<HTMLDivElement>;
  hasRichText?: boolean;
  className?: string;
}

export const TextBlock: FunctionComponent<Props> = ({
  text,
  refProp,
  className,
  hasRichText,
}) => {
  return (
    <div className={cx(styles.textBlock, className)} ref={refProp}>
      <span className={cx(hasRichText ? styles.richText : styles.simpleText)}>
        <ReactMarkdown
          children={text}
          allowedElements={config.markdownAllowedElements}
        />
      </span>
    </div>
  );
};
