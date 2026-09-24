import { FunctionComponent } from "react";
import { useIntl } from "react-intl";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";

import config from "../../../config/main";
import { markdownComponents } from "../../../libs/markdown-components";

const Attributions: FunctionComponent = () => {
  const intl = useIntl();

  return (
    <ReactMarkdown
      children={intl.formatMessage({ id: "attributionDescription" })}
      rehypePlugins={[rehypeRaw]}
      components={markdownComponents}
      allowedElements={config.markdownAllowedElements}
    />
  );
};

export default Attributions;
