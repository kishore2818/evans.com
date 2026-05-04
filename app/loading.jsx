export default function Loading() {
  return (
    <div className="px-6 md:px-12 pt-12 md:pt-16 pb-12">
      {/* Hero skeleton */}
      <div className="relative rounded-[2.5rem] overflow-hidden mb-8 bg-gradient-to-r from-[#f0f0f0] via-[#e0e0e0] to-[#f0f0f0] bg-[length:200%_100%] animate-shimmer" style={{ minHeight: 280 }} />

      {/* Categories skeleton */}
      <div className="px-6 mt-12">
        <div className="h-8 w-48 mx-auto rounded-xl bg-gradient-to-r from-[#f0f0f0] via-[#e0e0e0] to-[#f0f0f0] bg-[length:200%_100%] animate-shimmer mb-6" />
        <div className="flex space-x-6 overflow-hidden justify-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center space-y-2">
              <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-r from-[#f0f0f0] via-[#e0e0e0] to-[#f0f0f0] bg-[length:200%_100%] animate-shimmer" />
              <div className="h-3 w-14 rounded bg-gradient-to-r from-[#f0f0f0] via-[#e0e0e0] to-[#f0f0f0] bg-[length:200%_100%] animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
