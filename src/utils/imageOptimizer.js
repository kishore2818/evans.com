/**
 * Utility for ultra-fast responsive and optimized image delivery.
 * Automatically injects Cloudinary on-the-fly transformations (WebP/AVIF auto-format, auto-quality, size cap)
 * to reduce image payload by up to 90% and ensure lightning fast rendering.
 */
export const getOptimizedImageUrl = (url, width = 600) => {
  if (!url || typeof url !== 'string') return '/images/aloevera_gel.jpg';

  // If already relative or local asset, return as-is
  if (!url.startsWith('http')) return url;

  // Cloudinary image URL optimization
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    // If not already transformed, inject dynamic WebP/AVIF and auto-quality
    if (!url.includes('/f_auto')) {
      return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
    }
  }

  return url;
};

export default getOptimizedImageUrl;
