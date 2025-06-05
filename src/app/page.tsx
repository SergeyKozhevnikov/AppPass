'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // ✅ важно: next/navigation, а не next/router

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return null; // или Loader
}