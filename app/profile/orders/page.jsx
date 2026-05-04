'use client';
import Orders from '@/modules/Orders';
import { Suspense } from 'react';
export default function OrdersPage() { return <Suspense fallback={null}><Orders /></Suspense>; }
