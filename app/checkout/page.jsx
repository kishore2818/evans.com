'use client';
import Checkout from '@/modules/Checkout';
import { Suspense } from 'react';
export default function CheckoutPage() { return <Suspense fallback={null}><Checkout /></Suspense>; }
