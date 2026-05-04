import React from 'react';
import Skeleton from '../Skeleton';

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-[2.5rem] p-4 shadow-luxury border border-beige-100 flex flex-col h-full">
      <Skeleton height="220px" rounded="rounded-[2rem]" className="mb-4" />
      <div className="px-1 flex flex-col flex-grow space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton width="40%" height="10px" rounded="rounded-full" />
          <Skeleton width="25%" height="10px" rounded="rounded-full" />
        </div>
        <Skeleton width="90%" height="20px" rounded="rounded-lg" />
        <Skeleton width="70%" height="20px" rounded="rounded-lg" />
        <div className="flex justify-between items-center pt-4 mt-auto">
          <Skeleton width="40%" height="24px" rounded="rounded-md" />
          <Skeleton width="30%" height="16px" rounded="rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
