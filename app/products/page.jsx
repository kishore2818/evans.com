import API_BASE_URL from '@/config/api';
import ProductsClient from '@/components/products/ProductsClient';
import { products as fallbackProducts } from '@/data/products';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getProducts() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`${API_BASE_URL}/api/products`, {
      cache: 'no-store',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data
          .map(p => ({
            ...p,
            id: p._id,
            image: p.images && p.images.length > 0 ? p.images[0] : (p.image || '/images/aloevera_gel.jpg'),
            rating: p.ratings?.average || p.rating || 5,
            reviews: p.ratings?.count || p.reviews?.length || p.reviews || 0
          }))
          // Sort newest first (most recently added products at top)
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      }
    }
  } catch (error) {
    // Graceful fallback to rich local catalog
  }
  return fallbackProducts;
}

export const metadata = {
  title: 'Collection',
  description: 'Explore our full collection of organic botanical skincare products. From serums to soaps, find the perfect natural solution for your skin.',
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <Suspense fallback={
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-4 md:px-12 pt-6 pb-12">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-[2rem] h-80 animate-shimmer" />
        ))}
      </div>
    }>
      <ProductsClient initialProducts={products} />
    </Suspense>
  );
}
