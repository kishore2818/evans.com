import API_BASE_URL from '@/config/api';
import HomeClient from '@/components/home/HomeClient';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

async function getProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      console.error('Failed to fetch products for home page. Status:', response.status);
      return [];
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      console.error('Expected array but got:', typeof data);
      return [];
    }
    return data.map(p => ({
      ...p,
      id: p._id,
      image: p.images && p.images.length > 0 ? p.images[0] : '/images/placeholder.png',
      rating: p.ratings?.average || 5,
      reviews: p.ratings?.count || 0
    }));
  } catch (error) {
    console.error("Failed to fetch products for home page:", error);
    return [];
  }
}

export default async function Page() {
  const products = await getProducts();

  return (
    <Suspense fallback={<div className="p-12 text-center text-purple-900 font-serif">Loading Evans Luxe...</div>}>
      <HomeClient initialProducts={products} />
    </Suspense>
  );
}

