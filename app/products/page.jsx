import API_BASE_URL from '@/config/api';
import ProductsClient from '@/components/products/ProductsClient';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';


async function getProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      cache: "no-store"
    });
    
    if (!response.ok) {
      console.error('Failed to fetch products. Status:', response.status);
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
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export const metadata = {
  title: 'Collection',
  description: 'Explore our full collection of organic botanical skincare products. From serums to soaps, find the perfect natural solution for your skin.',
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <Suspense fallback={<div className="p-12 text-center">Loading collection...</div>}>
      <ProductsClient initialProducts={products} />
    </Suspense>
  );
}
