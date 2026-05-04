'use client';
import Profile from '@/modules/Profile';
import { Suspense } from 'react';
export default function ProfilePage() { return <Suspense fallback={null}><Profile /></Suspense>; }
