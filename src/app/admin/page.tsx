'use client';

import { usePostStore } from '@/stores/postStore';
import { KpiCard } from '@/components/common/KpiCard';
import Link from 'next/link';
import { FileText, Flag, Trash2, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { formatRelative, formatDate } from '@/lib/utils';
import { reportReasonLabels, takedownTypeLabels } from '@/lib/format';

export default function AdminDashboard() {
  const { posts, reports, takedowns, logs } = usePostStore();

  const pendingPosts = posts.filter(p => p.status === 'pending');
  const approvedPosts = posts.filter(p => p.status === 'approved');
  const pendingReports = reports.filter(r => r.status === 'pending');
  const pendingTakedowns = takedowns.filter(t => t.status === 'pending');

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">管理ダッシュボード</h1>
        <p className="text-sm text-gray-500 mt-1">HU就活ナビ 運営管理パネル</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="審査待ち" value={pendingPosts.length} icon={Clock} color="yellow" />
        <KpiCard label="公開中" value={approvedPosts.length} icon={CheckCircle2} color="green" />
        <KpiCard label="通報（未対応）" value={pendingReports.length} icon={Flag} color="red" />
        <KpiCard label="削除依頼（未対応）" value={pendingTakedowns.length} icon={Trash2} color="purple" />
      </div>

      {/* Quick action */}
      {pendingPosts.length > 0 && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <span className="font-medium text-yellow-800">{pendingPosts.length}件の投稿が審査待ちです</span>
          </div>
          <Link href="/admin/posts" className="rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-yellow-700">
            審査する →
          </Link>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent pending posts */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2"><FileText className="h-4 w-4 text-blue-500" />審査待ち投稿</h2>
            <Link href="/admin/posts?status=pending" className="text-xs text-blue-600 hover:underline flex items-center gap-0.5">すべて <ChevronRight className="h-3 w-3" /></Link>
          </div>
          {pendingPosts.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">審査待ちの投稿はありません</p>
          ) : (
            <div className="space-y-2">
              {pendingPosts.slice(0, 5).map(post => (
                <Link key={post.id} href={`/admin/posts/${post.id}`}
                  className="flex items-start justify-between gap-2 rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{post.companyName}</p>
                    <p className="text-xs text-gray-500">{post.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatRelative(post.createdAt)}</p>
                  </div>
                  {post.dangerFlagCount > 0 && (
                    <span className="shrink-0 rounded-full bg-red-100 px-1.5 py-0.5 text-xs text-red-700">⚠ {post.dangerFlagCount}</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent reports */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2"><Flag className="h-4 w-4 text-red-500" />最近の通報</h2>
            <Link href="/admin/reports" className="text-xs text-blue-600 hover:underline flex items-center gap-0.5">すべて <ChevronRight className="h-3 w-3" /></Link>
          </div>
          {reports.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">通報はありません</p>
          ) : (
            <div className="space-y-2">
              {reports.slice(0, 5).map(report => (
                <div key={report.id} className="rounded-lg border border-gray-100 p-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700">{reportReasonLabels[report.reason]}</span>
                    <span className={`text-xs ${report.status === 'pending' ? 'text-orange-600' : 'text-gray-400'}`}>{report.status === 'pending' ? '未対応' : '対応済み'}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 truncate">対象: {report.postId}</p>
                  <p className="text-xs text-gray-400">{formatRelative(report.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Takedown requests */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2"><Trash2 className="h-4 w-4 text-purple-500" />最近の削除依頼</h2>
            <Link href="/admin/takedowns" className="text-xs text-blue-600 hover:underline flex items-center gap-0.5">すべて <ChevronRight className="h-3 w-3" /></Link>
          </div>
          {takedowns.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">削除依頼はありません</p>
          ) : (
            <div className="space-y-2">
              {takedowns.slice(0, 4).map(t => (
                <div key={t.id} className="rounded-lg border border-gray-100 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">{takedownTypeLabels[t.requestType]}</span>
                    <span className={`text-xs ${t.status === 'pending' ? 'text-orange-600' : 'text-gray-400'}`}>{t.status === 'pending' ? '未対応' : '対応済み'}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500 truncate">{t.reason}</p>
                  <p className="text-xs text-gray-400">{formatRelative(t.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent logs */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">最近の操作ログ</h2>
            <Link href="/admin/logs" className="text-xs text-blue-600 hover:underline flex items-center gap-0.5">すべて <ChevronRight className="h-3 w-3" /></Link>
          </div>
          <div className="space-y-2">
            {[...logs].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5).map(log => (
              <div key={log.id} className="flex items-start gap-2 text-xs">
                <span className="shrink-0 mt-0.5 rounded bg-gray-100 px-1.5 py-0.5 font-medium text-gray-600">{log.action}</span>
                <span className="text-gray-500">{log.operatorName} · {formatDate(log.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
