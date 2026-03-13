'use client';

import { useState } from 'react';
import { usePostStore } from '@/stores/postStore';
import { PostStatus } from '@/features/posts/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { selectionTypeLabels, jobFamilyLabels, postStatusLabels } from '@/lib/format';
import { Search, ChevronRight, AlertTriangle, Paperclip } from 'lucide-react';
import { Input } from '@/components/ui/input';

const statusTabs: PostStatus[] = ['pending', 'revise', 'approved', 'rejected', 'draft', 'unpublished'];

export default function AdminPostsPage() {
  const { posts } = usePostStore();
  const [activeStatus, setActiveStatus] = useState<PostStatus>('pending');
  const [query, setQuery] = useState('');

  const filtered = posts
    .filter(p => p.status === activeStatus)
    .filter(p => !query || p.companyName.toLowerCase().includes(query.toLowerCase()) || p.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const countByStatus = (s: PostStatus) => posts.filter(p => p.status === s).length;

  return (
    <div className="space-y-4 max-w-5xl">
      <h1 className="text-xl font-bold text-gray-900">投稿審査</h1>

      {/* Status tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-gray-200 bg-white rounded-t-xl px-2">
        {statusTabs.map(s => {
          const count = countByStatus(s);
          return (
            <button key={s} onClick={() => setActiveStatus(s)}
              className={`flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${activeStatus === s ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {postStatusLabels[s]}
              {count > 0 && <span className={`rounded-full px-1.5 py-0.5 text-xs ${activeStatus === s ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="企業名・タイトルで絞り込み" className="pl-9" />
      </div>

      <p className="text-xs text-gray-500">{filtered.length}件</p>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">該当する投稿はありません</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(post => (
              <Link key={post.id} href={`/admin/posts/${post.id}`}
                className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <StatusBadge status={post.status} />
                    {post.dangerFlagCount > 0 && (
                      <span className="flex items-center gap-0.5 rounded-full bg-red-100 px-1.5 py-0.5 text-xs text-red-700">
                        <AlertTriangle className="h-3 w-3" />{post.dangerFlagCount}
                      </span>
                    )}
                    {post.evidenceFiles.length > 0 && (
                      <span className="flex items-center gap-0.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                        <Paperclip className="h-3 w-3" />{post.evidenceFiles.length}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{post.companyName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{post.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectionTypeLabels[post.selectionType]} · {jobFamilyLabels[post.jobFamily]} · {post.graduationYear}卒 · 設問{post.questions.length}問 · {formatDate(post.createdAt)}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 mt-1" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
