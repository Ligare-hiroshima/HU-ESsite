'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePostStore } from '@/stores/postStore';
import { Post, PostStatus } from '@/features/posts/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { VerificationBadge } from '@/components/common/VerificationBadge';
import { QuestionAnswerCard } from '@/components/posts/QuestionAnswerCard';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { formatDate, formatDateTime, generateId } from '@/lib/utils';
import { selectionTypeLabels, jobFamilyLabels, broadFieldLabels, academicLevelLabels, huFacultyLabels } from '@/lib/format';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, FileText, AlertTriangle, Paperclip, CheckCircle2, XCircle, RotateCcw, EyeOff } from 'lucide-react';

const CHECKLIST = [
  '個人情報（氏名・連絡先・学籍番号等）が含まれていない',
  '証跡と本文内容が整合している',
  '虚偽・誇大な内容でない',
  '企業の機密情報・守秘義務に抵触しない',
  '差別的・不適切な表現が含まれていない',
  '第三者の個人情報が含まれていない',
];

export default function AdminPostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { posts, updatePost, addLog } = usePostStore();
  const post = posts.find(p => p.id === id);

  const [checklist, setChecklist] = useState<boolean[]>(CHECKLIST.map(() => false));
  const [reviewNote, setReviewNote] = useState(post?.reviewNote ?? '');
  const [reviewerMessage, setReviewerMessage] = useState(post?.reviewerMessage ?? '');
  const [confirmAction, setConfirmAction] = useState<PostStatus | null>(null);
  const [done, setDone] = useState(false);

  if (!post) notFound();

  const allChecked = checklist.every(Boolean);

  const doAction = (newStatus: PostStatus) => {
    const updated: Post = {
      ...post,
      status: newStatus,
      verificationStatus: newStatus === 'approved' ? 'verified' : newStatus === 'rejected' ? 'flagged' : post.verificationStatus,
      reviewNote,
      reviewerMessage,
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: newStatus === 'approved' ? new Date().toISOString() : post.publishedAt,
    };
    updatePost(updated);
    addLog({
      id: generateId(),
      operatorId: 'admin1',
      operatorName: '管理者A',
      targetId: post.id,
      targetType: 'post',
      action: newStatus === 'approved' ? '承認' : newStatus === 'rejected' ? '却下' : newStatus === 'revise' ? '差し戻し' : '一時非公開',
      meta: { previousStatus: post.status, newStatus },
      createdAt: new Date().toISOString(),
    });
    setDone(true);
    setTimeout(() => router.push('/admin/posts'), 1500);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <CheckCircle2 className="h-14 w-14 text-green-500 mb-3" />
        <p className="font-medium text-gray-800">審査アクションを実行しました</p>
        <p className="text-sm text-gray-500">投稿一覧に戻ります...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/posts" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeft className="h-4 w-4" />戻る
        </Link>
        <div className="flex items-center gap-2">
          <StatusBadge status={post.status} />
          <VerificationBadge status={post.verificationStatus} />
          {post.dangerFlagCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
              <AlertTriangle className="h-3 w-3" />危険フラグ {post.dangerFlagCount}件
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Left: Post content */}
        <div className="space-y-4">
          {/* Basic info */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-3">基本情報</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div><span className="text-gray-500">企業名</span><p className="font-medium">{post.companyName}</p></div>
              <div><span className="text-gray-500">業界</span><p>{post.industry}</p></div>
              <div><span className="text-gray-500">選考種別</span><p>{selectionTypeLabels[post.selectionType]}</p></div>
              <div><span className="text-gray-500">職種</span><p>{jobFamilyLabels[post.jobFamily]}</p></div>
              <div><span className="text-gray-500">卒年</span><p>{post.graduationYear}卒</p></div>
              <div><span className="text-gray-500">文理</span><p>{broadFieldLabels[post.broadField]}</p></div>
              <div><span className="text-gray-500">学年</span><p>{academicLevelLabels[post.academicLevel]}</p></div>
              <div><span className="text-gray-500">学部・研究科</span><p>{post.faculty ? huFacultyLabels[post.faculty] : '未設定'}</p></div>
              <div><span className="text-gray-500">投稿日</span><p>{formatDate(post.createdAt)}</p></div>
            </div>
            {post.posterMemo && (
              <div className="mt-3 rounded-lg bg-blue-50 border border-blue-100 p-3 text-sm text-blue-800">
                <p className="font-medium text-xs mb-1 text-blue-600">投稿者メモ</p>
                {post.posterMemo}
              </div>
            )}
          </div>

          {/* Q&A */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">設問・回答（{post.questions.length}問）</h2>
            <div className="space-y-3">
              {post.questions.map((q, i) => <QuestionAnswerCard key={q.id} item={q} index={i} />)}
            </div>
          </div>
        </div>

        {/* Right: Evidence + Actions */}
        <div className="space-y-4">
          {/* Evidence */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-gray-400" />証跡ファイル ({post.evidenceFiles.length})
            </h3>
            {post.evidenceFiles.length === 0 ? (
              <p className="text-xs text-gray-400">証跡なし</p>
            ) : (
              <div className="space-y-2">
                {post.evidenceFiles.map(f => (
                  <div key={f.id} className="flex items-center gap-2 rounded-lg border border-gray-100 p-2.5 text-xs">
                    <FileText className="h-4 w-4 text-gray-300 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-700">{f.fileName}</p>
                      <p className="text-gray-400">{f.fileType === 'submission' ? '提出本文' : '通過証跡'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checklist */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">審査チェックリスト</h3>
            <div className="space-y-2">
              {CHECKLIST.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Checkbox id={`check-${i}`} checked={checklist[i]}
                    onCheckedChange={v => setChecklist(prev => prev.map((c, j) => j === i ? !!v : c))} />
                  <label htmlFor={`check-${i}`} className="cursor-pointer text-xs text-gray-700 leading-relaxed">{item}</label>
                </div>
              ))}
            </div>
            {!allChecked && (
              <p className="mt-2 text-xs text-amber-600">すべてチェックしてから承認できます</p>
            )}
          </div>

          {/* Notes */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-800">メモ・メッセージ</h3>
            <div>
              <Label className="mb-1 block text-xs font-medium text-gray-500">内部メモ（非公開）</Label>
              <Textarea value={reviewNote} onChange={e => setReviewNote(e.target.value)} placeholder="審査記録（内部用）" rows={2} className="text-xs" />
            </div>
            <div>
              <Label className="mb-1 block text-xs font-medium text-gray-500">投稿者へのメッセージ（差し戻し・却下時に表示）</Label>
              <Textarea value={reviewerMessage} onChange={e => setReviewerMessage(e.target.value)} placeholder="差し戻し理由など" rows={2} className="text-xs" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">
            <h3 className="font-semibold text-gray-800 mb-3">審査アクション</h3>
            <button
              disabled={!allChecked}
              onClick={() => setConfirmAction('approved')}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <CheckCircle2 className="h-4 w-4" />承認・公開
            </button>
            <button onClick={() => setConfirmAction('revise')}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600 transition-colors">
              <RotateCcw className="h-4 w-4" />差し戻し
            </button>
            <button onClick={() => setConfirmAction('rejected')}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors">
              <XCircle className="h-4 w-4" />却下
            </button>
            <button onClick={() => setConfirmAction('unpublished')}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <EyeOff className="h-4 w-4" />一時非公開
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={v => !v && setConfirmAction(null)}
        title={`この投稿を${confirmAction === 'approved' ? '承認' : confirmAction === 'rejected' ? '却下' : confirmAction === 'revise' ? '差し戻し' : '一時非公開に'}しますか？`}
        description="この操作はマイ投稿一覧と監査ログに反映されます。"
        confirmLabel="実行する"
        variant={confirmAction === 'rejected' ? 'destructive' : 'default'}
        onConfirm={() => confirmAction && doAction(confirmAction)}
      />
    </div>
  );
}
