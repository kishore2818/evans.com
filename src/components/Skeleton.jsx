import React from 'react';

const Skeleton = ({ className, width, height, rounded = 'rounded-md' }) => {
  return (
    <div 
      className={`animate-shimmer ${rounded} ${className}`}
      style={{ width, height }}
    />
  );
};

export default Skeleton;
