'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSubmitStore } from '@/stores/submitStore';
import { usePostStore } from '@/stores/postStore';
import { detectMaskCandidates, MaskCandidate } from '@/lib/masking';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { generateId } from '@/lib/utils';
import { Post } from '@/features/posts/types';
import { AlertTriangle, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function SubmitMaskingPage() {
  const router = useRouter();
  const { draft, updateDraft, resetDraft } = useSubmitStore();
  const { addPost } = usePostStore();
  const [confirmed, setConfirmed] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const allText = draft.questions.map(q => q.answer).join('\n\n---\n\n');
  const [candidates, setCandidates] = useState<MaskCandidate[]>(() => detectMaskCandidates(allText));

  const toggle = (id: string) => setCandidates(prev => prev.map(c => c.id === id ? { ...c, masked: !c.masked } : c));
  const maskAll = () => setCandidates(prev => prev.map(c => ({ ...c, masked: true })));
  const clearAll = () => setCandidates(prev => prev.map(c => ({ ...c, masked: false })));

  // Apply masking per-question
  const maskedQuestions = useMemo(() => {
    return draft.questions.map((q) => {
      let answer = q.answer;
      // Simple replacement: replace all masked values in this answer
      const maskedValues = new Set(candidates.filter(c => c.masked).map(c => c.value));
      maskedValues.forEach(val => {
        answer = answer.split(val).join('[MASK]');
      });
      return { ...q, answer, isMasked: maskedValues.size > 0 };
    });
  }, [draft.questions, candidates]);

  const handleSubmit = () => {
    if (!confirmed) return;
    const post: Post = {
      id: draft.id ?? generateId(),
      title: draft.title ?? `${draft.companyName ?? '不明'} ${draft.graduationYear ?? 2026}卒 ES`,
      companyId: generateId(),
      companyName: draft.companyName ?? '不明',
      industry: draft.industry ?? 'その他',
      selectionType: draft.selectionType ?? 'full_time',
      jobFamily: (draft.jobFamily as Post['jobFamily']) ?? 'other',
      graduationYear: draft.graduationYear ?? 2026,
      academicLevel: (draft.academicLevel as Post['academicLevel']) ?? 'B4',
      broadField: (draft.broadField as Post['broadField']) ?? 'other',
      questions: maskedQuestions,
      posterMemo: draft.posterMemo,
      status: 'pending',
      verificationStatus: 'unverified',
      evidenceFiles: draft.evidenceFiles,
      dangerFlagCount: candidates.filter(c => !c.masked).length,
      posterUserId: 'user1',
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addPost(post);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">投稿を受け付けました</h2>
        <p className="mt-2 text-sm text-gray-500 max-w-sm">運営が確認後、問題がなければ公開されます。</p>
        <div className="mt-4 bg-gray-50 rounded-xl border p-4 max-w-sm text-left text-sm text-gray-600 space-y-1">
          <p className="font-medium text-gray-800 mb-2">次のステップ</p>
          <p>① 運営スタッフが内容を確認します</p>
          <p>② 承認されると公開されます</p>
          <p>③ 修正が必要な場合は差し戻しされます</p>
          <p>④ マイ投稿でステータスを確認できます</p>
        </div>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={() => { resetDraft(); router.push('/mypage/posts'); }}>マイ投稿を確認</Button>
          <Button onClick={() => { resetDraft(); router.push('/submit/basic'); }}>続けて投稿する</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            個人情報の自動検出 ({candidates.length}件)
          </h2>
          <div className="flex gap-2 text-xs">
            <button onClick={clearAll} className="text-gray-500 hover:text-gray-700">解除</button>
            <button onClick={maskAll} className="text-blue-600 hover:text-blue-800">全てマスク</button>
          </div>
        </div>
        {candidates.length === 0 ? (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-100 p-3 text-sm text-green-700">
            <ShieldCheck className="h-4 w-4" />個人情報は検出されませんでした
          </div>
        ) : (
          <div className="space-y-2">
            {candidates.map(c => (
              <div key={c.id} onClick={() => toggle(c.id)} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${c.masked ? 'border-blue-200 bg-blue-50' : 'border-orange-200 bg-orange-50'}`}>
                <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 text-xs font-bold ${c.masked ? 'border-blue-500 bg-blue-500 text-white' : 'border-orange-400 bg-white'}`}>
                  {c.masked && '✓'}
                </div>
                <div className="min-w-0 flex-1">
                  <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${c.masked ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>{c.label}</span>
                  <p className="mt-1 text-sm font-mono break-all text-gray-700">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2"><Eye className="h-4 w-4 text-blue-500" />公開プレビュー</h2>
          <button onClick={() => setShowPreview(!showPreview)} className="text-xs text-blue-600 hover:underline">{showPreview ? '折りたたむ' : '展開する'}</button>
        </div>
        {showPreview && (
          <div className="space-y-4">
            {maskedQuestions.map((q, i) => (
              <div key={q.id} className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{i + 1}</span>
                  <p className="text-sm font-medium">{q.question}</p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm leading-7 whitespace-pre-wrap text-gray-700">{q.answer}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Checkbox id="confirm" checked={confirmed} onCheckedChange={(v) => setConfirmed(v === true)} />
          <label htmlFor="confirm" className="cursor-pointer text-sm text-gray-700 leading-relaxed">
            内容を確認しました。個人を特定できる情報が含まれていないことを確認し、
            <a href="/terms" className="text-blue-600 underline mx-1">利用規約</a>と
            <a href="/guidelines" className="text-blue-600 underline mx-1">投稿ガイドライン</a>に同意します。
          </label>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.push('/submit/evidence')}>← 戻る</Button>
        <Button disabled={!confirmed} onClick={handleSubmit}>投稿を送信する</Button>
      </div>
    </div>
  );
}
