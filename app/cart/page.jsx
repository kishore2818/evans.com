'use client';
import Cart from '@/modules/Cart';
import { Suspense } from 'react';
export default function CartPage() { return <Suspense fallback={null}><Cart /></Suspense>; }
