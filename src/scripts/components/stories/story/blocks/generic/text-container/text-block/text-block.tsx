import { FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";

import config from "../../../../../../../config/main";

import styles from "./text-block.module.css";

interface Props {
  text: string;
  refProp?: React.Ref<HTMLDivElement>;
}

export const TextBlock: FunctionComponent<Props> = ({ text, refProp }) => {
  return (
    <div className={styles.textBlock} ref={refProp}>
      <ReactMarkdown
        children={text}
        allowedElements={config.markdownAllowedElements}
      />
    </div>
  );
};
