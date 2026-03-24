import { AnchorHTMLAttributes } from "react";

export const markdownComponents = {
/**
 * Shared react-markdown `components` override.
 *
 * Opens all markdown links in a new tab with `rel="noopener noreferrer"`.
 * Import and pass to the `components` prop of <ReactMarkdown> wherever
 * external links appear in markdown content.
 *
 * For components that need custom link-target logic (e.g. story-content,
 * where internal story links must open in the same tab), define a local
 * `components` override instead.
 */
  a: ({
    href,
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  ),
};
