'use client';
import Auth from '@/modules/Auth';
import { Suspense } from 'react';
export default function AuthPage() { return <Suspense fallback={null}><Auth /></Suspense>; }
