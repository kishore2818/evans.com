import React from 'react';
import Skeleton from '../Skeleton';

const CategorySkeleton = () => {
  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <Skeleton width="80px" height="80px" rounded="rounded-[2rem]" className="md:w-24 md:h-24" />
      <Skeleton width="60px" height="12px" rounded="rounded-full" className="mt-3" />
    </div>
  );
};

export default CategorySkeleton;
