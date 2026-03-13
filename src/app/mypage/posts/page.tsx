'use client';

import { useState } from 'react';
import { usePostStore } from '@/stores/postStore';
import { useViewerModeStore } from '@/stores/viewerModeStore';
import { Post, PostStatus } from '@/features/posts/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { selectionTypeLabels, jobFamilyLabels } from '@/lib/format';
import { formatDate } from '@/lib/utils';
import { FileText, Edit, Flag, Eye, AlertCircle } from 'lucide-react';

const POSTER_USER_ID = 'user1';

const tabs: { key: PostStatus; label: string }[] = [
  { key: 'draft', label: '下書き' },
  { key: 'pending', label: '審査待ち' },
  { key: 'revise', label: '差し戻し' },
  { key: 'approved', label: '公開済み' },
  { key: 'rejected', label: '却下' },
];

export default function MyPostsPage() {
  const { posts } = usePostStore();
  const { mode } = useViewerModeStore();
  const [activeTab, setActiveTab] = useState<PostStatus>('pending');

  const myPosts = posts.filter(p => p.posterUserId === POSTER_USER_ID);
  const tabPosts = myPosts.filter(p => p.status === activeTab);

  if (mode !== 'poster') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <h1 className="font-medium text-gray-700">「投稿者」モードで表示されます</h1>
        <p className="mt-1 text-sm text-gray-500">右上のモード切替から「投稿者」を選択してください</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">マイ投稿</h1>
          <p className="mt-1 text-sm text-gray-500">投稿の審査状況を確認できます</p>
        </div>
        <Link href="/submit/basic" className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">+ 新規投稿</Link>
      </div>

      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-gray-200">
        {tabs.map(tab => {
          const count = myPosts.filter(p => p.status === tab.key).length;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab.label}
              {count > 0 && <span className={`rounded-full px-1.5 py-0.5 text-xs ${activeTab === tab.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>{count}</span>}
            </button>
          );
        })}
      </div>

      {tabPosts.length === 0 ? (
        <EmptyState icon={FileText} title={`${tabs.find(t => t.key === activeTab)?.label}の投稿はありません`}
          action={activeTab === 'draft' ? <Link href="/submit/basic" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">ESを投稿する</Link> : undefined} />
      ) : (
        <div className="space-y-3">
          {tabPosts.map(post => <MyPostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  );
}

function MyPostCard({ post }: { post: Post }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <StatusBadge status={post.status} />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm">{post.title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{selectionTypeLabels[post.selectionType]} · {jobFamilyLabels[post.jobFamily]} · 更新：{formatDate(post.updatedAt)}</p>
        </div>
        {post.status === 'approved' && (
          <Link href={`/posts/${post.id}`} className="shrink-0 flex items-center gap-1 text-xs text-blue-600 hover:underline">
            <Eye className="h-3 w-3" />閲覧
          </Link>
        )}
      </div>

      {(post.status === 'revise' || post.status === 'rejected') && post.reviewerMessage && (
        <div className={`mt-3 rounded-lg border px-3 py-2 text-xs ${post.status === 'revise' ? 'border-orange-200 bg-orange-50 text-orange-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
          <p className="font-medium mb-0.5">{post.status === 'revise' ? '差し戻し理由' : '却下理由'}</p>
          <p>{post.reviewerMessage}</p>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        {(post.status === 'draft' || post.status === 'revise') && (
          <Link href="/submit/basic" className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1">
            <Edit className="h-3 w-3" />編集する
          </Link>
        )}
        {post.status === 'approved' && (
          <Link href="/takedown" className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1">
            <Flag className="h-3 w-3" />削除依頼
          </Link>
        )}
      </div>
    </div>
  );
}
