'use client';

import { useViewerModeStore } from '@/stores/viewerModeStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Flag, Trash2, ScrollText, Building2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'ダッシュボード', icon: LayoutDashboard, exact: true },
  { href: '/admin/posts', label: '投稿審査', icon: FileText },
  { href: '/admin/reports', label: '通報管理', icon: Flag },
  { href: '/admin/takedowns', label: '削除依頼', icon: Trash2 },
  { href: '/admin/logs', label: '監査ログ', icon: ScrollText },
  { href: '/admin/companies', label: '企業名正規化', icon: Building2 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { mode } = useViewerModeStore();
  const pathname = usePathname();

  if (mode !== 'admin') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="h-14 w-14 text-gray-300 mb-4" />
        <h1 className="text-xl font-bold text-gray-900">管理者専用エリア</h1>
        <p className="mt-2 text-sm text-gray-500">このページは管理者モードでのみアクセスできます。</p>
        <p className="mt-1 text-xs text-gray-400">右上のモード切替から「管理者」を選択してください。</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-gray-200 bg-white lg:block">
        <div className="sticky top-14 p-4">
          <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">管理メニュー</p>
          <nav className="space-y-1">
            {navItems.map(item => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}
                  className={cn('flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')}>
                  <item.icon className={cn('h-4 w-4', active ? 'text-purple-600' : 'text-gray-400')} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="lg:hidden w-full">
        <div className="flex overflow-x-auto border-b border-gray-200 bg-white px-4 py-2 gap-1">
          {navItems.map(item => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={cn('flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium',
                  active ? 'bg-purple-100 text-purple-700' : 'text-gray-600')}>
                <item.icon className="h-3.5 w-3.5" />{item.label}
              </Link>
            );
          })}
        </div>
        <div className="p-4">{children}</div>
      </div>

      <main className="hidden lg:block flex-1 p-6">{children}</main>
    </div>
  );
}
