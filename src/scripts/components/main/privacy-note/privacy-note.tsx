import { FunctionComponent } from "react";
import { useIntl } from "react-intl";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";

import config from "../../../config/main";
import { markdownComponents } from "../../../libs/markdown-components";

import styles from "./privacy-note.module.css";

const privacyNoteTranslations = import.meta.glob<string>(
  "./markdown/privacy-note-*.md",
  {
    eager: true,
    query: "?raw",
    import: "default",
  },
);

const PrivacyNote: FunctionComponent = () => {
  const intl = useIntl();
  const privacyNoteText =
    privacyNoteTranslations[`./markdown/privacy-note-${intl.locale}.md`] ??
    privacyNoteTranslations[`./markdown/privacy-note-en.md`];

  return (
    <div className={styles.privacyNote}>
      <div className={styles.content}>
        <ReactMarkdown
          children={privacyNoteText}
          rehypePlugins={[rehypeRaw]}
          components={markdownComponents}
          allowedElements={config.markdownAllowedElements}
        />
      </div>
    </div>
  );
};

export default PrivacyNote;
