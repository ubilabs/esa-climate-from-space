import { FunctionComponent } from "react";
import ReactMarkdown, { Options } from "react-markdown";
import { getStoryAssetUrl } from "../../../libs/get-story-asset-urls";

interface StoryMarkdownProps extends Omit<
  Options,
  "urlTransform" | "components"
> {
  /**
   * The storyId is used to transform relative URLs (images, links) to absolute URLs.
   * If not provided, URLs are passed through unchanged.
   */
  storyId?: string;
  /**
   * Optional components override. Will be merged with the default link component.
   */
  components?: Options["components"];
}

/**
 * StoryMarkdown is a wrapper around ReactMarkdown that handles URL transformation
 * and link target behavior for story content.
 *
 * - Transforms relative URLs (images/links) using getStoryAssetUrl when storyId is provided
 * - Opens links starting with "stories/" in the same tab (_self)
 * - Opens all other links in a new tab (_blank) with rel="noopener noreferrer"
 *
 * Use this component as a drop-in replacement for ReactMarkdown in story-related components.
 */
export const StoryMarkdown: FunctionComponent<StoryMarkdownProps> = ({
  storyId,
  components,
  children,
  ...props
}) => {
  const urlTransform = storyId
    ? (url: string) => getStoryAssetUrl(storyId, url)
    : undefined;

  const defaultComponents: Options["components"] = {
    a: ({ href, children, ...linkProps }) => (
      <a
        href={href}
        target={href?.startsWith("stories") ? "_self" : "_blank"}
        rel={href?.startsWith("stories") ? undefined : "noopener noreferrer"}
        {...linkProps}
      >
        {children}
      </a>
    ),
  };

  // Merge user-provided components with defaults
  const mergedComponents = {
    ...defaultComponents,
    ...components,
  };

  return (
    <ReactMarkdown
      urlTransform={urlTransform}
      components={mergedComponents}
      {...props}
    >
      {children}
    </ReactMarkdown>
  );
};
