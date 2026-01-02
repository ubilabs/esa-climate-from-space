import { FunctionComponent } from "react";
import { useIntl } from "react-intl";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";

import config from "../../../config/main";

import styles from "./about-project.module.css";

const AboutProject: FunctionComponent = () => {
  const intl = useIntl();

  return (
    <div className={styles.aboutProject}>
      <div className={styles.content}>
        <ReactMarkdown
          children={intl.formatMessage({ id: "projectDescription" })}
          rehypePlugins={[rehypeRaw]}
          allowedElements={config.markdownAllowedElements}
        />
      </div>
    </div>
  );
};

export default AboutProject;
