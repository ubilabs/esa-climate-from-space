import { FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";

import config from "../../../../../../../config/main";

import styles from "./text-section.module.css";
interface Props {
  text: string;
  refProp?: React.Ref<HTMLDivElement>;
}

export const TextSection: FunctionComponent<Props> = ({ text, refProp }) => {
  return (
    <div className={styles.textSection} ref={refProp}>
      <ReactMarkdown
        children={text}
        allowedElements={config.markdownAllowedElements}
      />
    </div>
  );
};
