import API_BASE_URL from '@/config/api';
import ProductDetailsClient from '@/components/products/ProductDetailsClient';
import { notFound } from 'next/navigation';

async function getProduct(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      cache: "no-store"
    });
    if (!response.ok) return null;
    const data = await response.json();
    return {
      ...data,
      id: data._id,
      images: data.images && data.images.length > 0 ? data.images : ['/images/placeholder.png'],
      rating: data.ratings?.average || 0,
      reviewsCount: data.ratings?.count || 0
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.description.substring(0, 160),
    openGraph: {
      title: `${product.name} | Evans Luxe Beauty`,
      description: product.description.substring(0, 160),
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // Check if purchased (simplified for SSR, client side will handle true state if needed)
  // In a real app, you'd check this against the user session on the server
  const hasPurchased = false; 

  return <ProductDetailsClient initialProduct={product} hasPurchased={hasPurchased} />;
}
