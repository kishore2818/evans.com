const ProductCardSkeleton = () => (
  <div className="bg-white rounded-[2.5rem] p-4 border border-beige-100/50 h-full flex flex-col">
    {/* Image skeleton */}
    <div className="rounded-[2rem] overflow-hidden aspect-square mb-4 bg-gradient-to-r from-[#f0f0f0] via-[#e0e0e0] to-[#f0f0f0] bg-[length:200%_100%] animate-shimmer" />

    {/* Stars + review line */}
    <div className="flex items-center space-x-2 mb-2">
      <div className="h-2 w-16 rounded bg-gradient-to-r from-[#f0f0f0] via-[#e0e0e0] to-[#f0f0f0] bg-[length:200%_100%] animate-shimmer" />
    </div>

    {/* Title line */}
    <div className="h-4 w-4/5 rounded bg-gradient-to-r from-[#f0f0f0] via-[#e0e0e0] to-[#f0f0f0] bg-[length:200%_100%] animate-shimmer mb-2" />
    <div className="h-4 w-3/5 rounded bg-gradient-to-r from-[#f0f0f0] via-[#e0e0e0] to-[#f0f0f0] bg-[length:200%_100%] animate-shimmer mb-4" />

    {/* Price + button row */}
    <div className="flex items-center justify-between mt-auto pt-2">
      <div className="h-6 w-20 rounded bg-gradient-to-r from-[#f0f0f0] via-[#e0e0e0] to-[#f0f0f0] bg-[length:200%_100%] animate-shimmer" />
      <div className="h-11 w-11 rounded-2xl bg-gradient-to-r from-[#f0f0f0] via-[#e0e0e0] to-[#f0f0f0] bg-[length:200%_100%] animate-shimmer" />
    </div>
  </div>
);

export const ProductsGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const HomeProductsSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export default ProductCardSkeleton;
