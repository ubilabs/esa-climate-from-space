import React, { forwardRef } from "react";

interface TextBlockProps {
  content?: string;
}

const TextBlockWithRef: React.ForwardRefRenderFunction<
  HTMLDivElement,
  TextBlockProps
> = ({ content }, ref) => {
  return (
    <div ref={ref}>
      {content || "Default Text Block Content"}
    </div>
  );
};

const TextBlock = forwardRef(TextBlockWithRef);

export default TextBlock;


