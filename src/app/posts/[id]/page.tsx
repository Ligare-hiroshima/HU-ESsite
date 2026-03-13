'use client';

import { use, useState } from 'react';
import { usePostStore } from '@/stores/postStore';
import { QuestionAnswerCard } from '@/components/posts/QuestionAnswerCard';
import { VerificationBadge } from '@/components/common/VerificationBadge';
import { ReportModal } from '@/components/common/ReportModal';
import { PostCard } from '@/components/posts/PostCard';
import { buttonVariants } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { selectionTypeLabels, jobFamilyLabels, broadFieldLabels, academicLevelLabels, huFacultyLabels } from '@/lib/format';
import { formatDate } from '@/lib/utils';
import { Flag, ChevronRight, FileText, AlertCircle } from 'lucide-react';

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { posts } = usePostStore();
  const [reportOpen, setReportOpen] = useState(false);

  const post = posts.find(p => p.id === id);

  if (!post || post.status !== 'approved') {
    notFound();
  }

  const related = posts.filter(p => p.status === 'approved' && p.id !== id && p.companyId === post.companyId).slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700">ホーム</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/posts" className="hover:text-gray-700">ES一覧</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">{post.companyName}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Main */}
        <div className="space-y-6">
          {/* Header card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{post.industry}</span>
              <span className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-600">{selectionTypeLabels[post.selectionType]}</span>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{post.graduationYear}卒</span>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{academicLevelLabels[post.academicLevel]}</span>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{broadFieldLabels[post.broadField]}</span>
              {post.faculty && (
                <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">{huFacultyLabels[post.faculty]}</span>
              )}
              <VerificationBadge status={post.verificationStatus} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{post.companyName}</h1>
            <p className="mt-1 text-sm text-gray-600">{jobFamilyLabels[post.jobFamily]}</p>
            <p className="mt-1 text-xs text-gray-400">投稿日: {formatDate(post.publishedAt || post.createdAt)}</p>

            {post.posterMemo && (
              <div className="mt-4 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
                <p className="text-xs font-medium text-blue-700 mb-1">投稿者メモ</p>
                <p className="text-sm text-blue-900 leading-relaxed">{post.posterMemo}</p>
              </div>
            )}
          </div>

          {/* Questions */}
          <div>
            <h2 className="mb-3 text-base font-semibold text-gray-800">設問と回答 ({post.questions.length}問)</h2>
            <div className="space-y-4">
              {post.questions.map((q, i) => (
                <QuestionAnswerCard key={q.id} item={q} index={i} />
              ))}
            </div>
          </div>

          {/* Masked note */}
          {post.questions.some(q => q.isMasked) && (
            <div className="rounded-lg bg-amber-50 border border-amber-100 px-4 py-3 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-800">
                この投稿の一部は個人情報保護のため <code className="rounded bg-amber-100 px-1 font-mono text-xs">[MASK]</code> 処理されています。
              </p>
            </div>
          )}

          {/* Report */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setReportOpen(true)}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              <Flag className="h-3.5 w-3.5" />
              この投稿を通報する
            </button>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div>
              <h2 className="mb-3 text-base font-semibold text-gray-800">{post.companyName}の他の投稿</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {related.map(p => <PostCard key={p.id} post={p} />)}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm space-y-3">
            <div className="flex items-center gap-2 font-medium text-gray-800">
              <FileText className="h-4 w-4 text-blue-600" />
              この投稿について
            </div>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                この投稿は匿名で公開されています
              </li>
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                投稿者の個人情報は一切公開されていません
              </li>
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                内容は運営が審査しています
              </li>
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                必ずしも選考通過を保証するものではありません
              </li>
            </ul>
            <hr className="border-gray-200" />
            <p className="text-xs text-gray-500">
              問題のある投稿は通報・削除依頼をお願いします。
            </p>
            <div className="flex flex-col gap-2">
              <button onClick={() => setReportOpen(true)} className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 hover:bg-gray-50">
                <Flag className="h-3 w-3" />
                通報する
              </button>
              <Link href="/takedown" className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 hover:bg-gray-50">
                削除依頼
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm">
            <p className="font-medium text-blue-800 mb-1">あなたのESも投稿しませんか？</p>
            <p className="text-xs text-blue-700 mb-3">通過ESを共有して、後輩の就活を応援しましょう。完全匿名で投稿できます。</p>
            <Link href="/submit/basic" className={buttonVariants({ size: 'sm', className: 'w-full justify-center' })}>ESを投稿する</Link>
          </div>
        </aside>
      </div>

      <ReportModal postId={post.id} open={reportOpen} onOpenChange={setReportOpen} />
    </div>
  );
}
