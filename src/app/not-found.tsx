'use client';

import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { FileSearch } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <FileSearch className="h-16 w-16 text-gray-300 mb-4" />
      <h1 className="text-2xl font-bold text-gray-900">ページが見つかりません</h1>
      <p className="mt-2 text-gray-500">お探しのページは存在しないか、移動した可能性があります。</p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className={buttonVariants()}>ホームへ戻る</Link>
        <Link href="/posts" className={buttonVariants({ variant: 'outline' })}>ES一覧</Link>
      </div>
    </div>
  );
}
