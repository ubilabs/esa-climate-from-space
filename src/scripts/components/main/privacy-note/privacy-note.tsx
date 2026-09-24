import { FunctionComponent, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";

import config from "../../../config/main";
import { markdownComponents } from "../../../libs/markdown-components";

import styles from "./privacy-note.module.css";

const privacyNoteUrls = import.meta.glob<string>(
  "~/assets/markdown/privacy-note-*.md",
  {
    eager: true,
    query: "?url&no-inline",
    import: "default",
  },
);

const PrivacyNote: FunctionComponent = () => {
  const intl = useIntl();
  const [privacyNoteText, setPrivacyNoteText] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const localizedUrl =
      privacyNoteUrls[`../assets/markdown/privacy-note-${intl.locale}.md`];
    const englishUrl = privacyNoteUrls["../assets/markdown/privacy-note-en.md"];

    async function loadPrivacyNote() {
      for (const url of new Set([localizedUrl, englishUrl])) {
        if (!url) continue;
        try {
          const response = await fetch(url, { signal: controller.signal });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const text = await response.text();
          if (!controller.signal.aborted) setPrivacyNoteText(text);
          return;
        } catch (error) {
          if (controller.signal.aborted) return;
          console.error("Could not load privacy note", error);
        }
      }
    }

    void loadPrivacyNote();
    return () => controller.abort();
  }, [intl.locale]);

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
