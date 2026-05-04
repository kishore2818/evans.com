'use client';
import Wishlist from '@/modules/Wishlist';
import { Suspense } from 'react';
export default function WishlistPage() { return <Suspense fallback={null}><Wishlist /></Suspense>; }
