import { ProductsGridSkeleton } from '@/components/ProductCardSkeleton';

export default function Loading() {
  return (
    <div className="px-6 md:px-12 pt-12 md:pt-16 pb-12">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-6 md:mb-10">
        <div className="h-9 w-36 rounded-xl bg-gradient-to-r from-[#f0f0f0] via-[#e0e0e0] to-[#f0f0f0] bg-[length:200%_100%] animate-shimmer" />
        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#f0f0f0] via-[#e0e0e0] to-[#f0f0f0] bg-[length:200%_100%] animate-shimmer" />
      </div>

      {/* Search bar skeleton */}
      <div className="h-12 w-full rounded-full bg-gradient-to-r from-[#f0f0f0] via-[#e0e0e0] to-[#f0f0f0] bg-[length:200%_100%] animate-shimmer mb-6" />

      {/* Category pills skeleton */}
      <div className="flex space-x-2 mb-8 overflow-hidden">
        {[80, 96, 72, 88, 64].map((w, i) => (
          <div
            key={i}
            className="flex-shrink-0 h-11 rounded-full bg-gradient-to-r from-[#f0f0f0] via-[#e0e0e0] to-[#f0f0f0] bg-[length:200%_100%] animate-shimmer"
            style={{ width: `${w}px` }}
          />
        ))}
      </div>

      {/* Product grid skeleton */}
      <ProductsGridSkeleton count={8} />
    </div>
  );
}
