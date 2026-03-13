'use client';

import { useEffect } from 'react';
import { usePostStore } from '@/stores/postStore';

export function StoreInitializer() {
  const initialize = usePostStore((s) => s.initialize);
  useEffect(() => { initialize(); }, [initialize]);
  return null;
}
