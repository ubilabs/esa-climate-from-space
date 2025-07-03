import React from 'react';

const TextBlock: React.FC<{ content?: string }> = ({ content }) => {
  return (
    <div>
      {content || 'Default Text Block Content'}
    </div>
  );
};

export default TextBlock;

