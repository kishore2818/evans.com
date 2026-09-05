'use client';
import Account from '@/modules/Account';
import { Suspense } from 'react';
export default function AccountPage() { return <Suspense fallback={null}><Account /></Suspense>; }
