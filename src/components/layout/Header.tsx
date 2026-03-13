'use client';

import Link from 'next/link';
import { useViewerModeStore } from '@/stores/viewerModeStore';
import { ModeToggle } from './ModeToggle';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { mode } = useViewerModeStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 hover:opacity-80">
          <GraduationCap className="h-6 w-6 text-blue-600" />
          <span className="text-base">HU就活ナビ</span>
          <span className="hidden rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 sm:inline">β版</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/posts" className="text-sm text-gray-600 hover:text-gray-900">ES一覧</Link>
          <Link href="/guidelines" className="text-sm text-gray-600 hover:text-gray-900">投稿ガイドライン</Link>
          <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">利用規約</Link>
          {mode === 'poster' && (
            <Link href="/submit/basic" className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
              ESを投稿する
            </Link>
          )}
          {mode === 'admin' && (
            <Link href="/admin" className="rounded-md bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700">
              管理画面
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <ModeToggle />
          </div>
          {mode === 'poster' && (
            <Link href="/mypage/posts" className="hidden text-sm text-gray-600 hover:text-gray-900 md:block">
              マイ投稿
            </Link>
          )}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
          <div className="mb-4">
            <ModeToggle />
          </div>
          <nav className="flex flex-col gap-3">
            <Link href="/posts" className="text-sm text-gray-700" onClick={() => setMobileOpen(false)}>ES一覧</Link>
            <Link href="/guidelines" className="text-sm text-gray-700" onClick={() => setMobileOpen(false)}>投稿ガイドライン</Link>
            <Link href="/terms" className="text-sm text-gray-700" onClick={() => setMobileOpen(false)}>利用規約</Link>
            {mode === 'poster' && (
              <>
                <Link href="/submit/basic" className="text-sm text-blue-600 font-medium" onClick={() => setMobileOpen(false)}>ESを投稿する</Link>
                <Link href="/mypage/posts" className="text-sm text-gray-700" onClick={() => setMobileOpen(false)}>マイ投稿</Link>
              </>
            )}
            {mode === 'admin' && (
              <Link href="/admin" className="text-sm text-purple-600 font-medium" onClick={() => setMobileOpen(false)}>管理画面</Link>
            )}
          </nav>
        </div>
      )}

      {/* Dev notice */}
      <div className="bg-amber-50 px-4 py-1 text-center text-[11px] text-amber-700">
        ⚠ これはフロントエンドプロトタイプです。認証・DB・APIは未実装です。右上のモード切替でUI確認できます。
      </div>
    </header>
  );
}
