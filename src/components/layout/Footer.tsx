import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <GraduationCap className="h-5 w-5" />
            <span className="text-sm font-medium">HU就活ナビ</span>
            <span className="text-xs text-gray-400">広島大学生専用ESシェアサービス</span>
          </div>
          <nav className="flex gap-4 text-xs text-gray-500">
            <Link href="/terms" className="hover:text-gray-700">利用規約</Link>
            <Link href="/guidelines" className="hover:text-gray-700">投稿ガイドライン</Link>
            <Link href="/takedown" className="hover:text-gray-700">削除依頼</Link>
          </nav>
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">
          © 2025 HU就活ナビ（プロトタイプ）広島大学生限定サービス
        </p>
      </div>
    </footer>
  );
}
