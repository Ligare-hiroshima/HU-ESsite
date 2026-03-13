'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSubmitStore } from '@/stores/submitStore';
import { PostQuestionItem } from '@/features/posts/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { generateId } from '@/lib/utils';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export default function SubmitQuestionsPage() {
  const router = useRouter();
  const { draft, updateDraft } = useSubmitStore();
  const [questions, setQuestions] = useState<PostQuestionItem[]>(
    draft.questions.length > 0 ? draft.questions : []
  );

  const addQuestion = () => {
    setQuestions(prev => [...prev, { id: generateId(), order: prev.length + 1, question: '', answer: '', isMasked: false }]);
  };

  const update = (id: string, field: keyof PostQuestionItem, value: string | number | boolean) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const remove = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id).map((q, i) => ({ ...q, order: i + 1 })));
  };

  const move = (id: string, dir: 'up' | 'down') => {
    setQuestions(prev => {
      const idx = prev.findIndex(q => q.id === id);
      if (dir === 'up' && idx === 0) return prev;
      if (dir === 'down' && idx === prev.length - 1) return prev;
      const arr = [...prev];
      const swap = dir === 'up' ? idx - 1 : idx + 1;
      [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
      return arr.map((q, i) => ({ ...q, order: i + 1 }));
    });
  };

  const canProceed = questions.length > 0 && questions.every(q => q.question.trim() && q.answer.trim());

  const next = () => { updateDraft({ questions, currentStep: 2 }); router.push('/submit/evidence'); };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">設問・回答入力</h2>
          <span className="text-xs text-gray-400">{questions.length}問</span>
        </div>
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{idx + 1}</span>
                <div className="flex gap-1">
                  <button type="button" onClick={() => move(q.id, 'up')} disabled={idx === 0} className="rounded p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                  <button type="button" onClick={() => move(q.id, 'down')} disabled={idx === questions.length - 1} className="rounded p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                  <button type="button" onClick={() => remove(q.id)} className="rounded p-1 text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div>
                <Label className="mb-1 block text-xs font-medium text-gray-600">設問文 *</Label>
                <Input value={q.question} onChange={e => update(q.id, 'question', e.target.value)} placeholder="例：学生時代に力を入れたことを教えてください" className="text-sm" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs font-medium text-gray-600">回答 *</Label>
                  <div className="flex items-center gap-2">
                    <input type="number" value={q.charLimit ?? ''} onChange={e => update(q.id, 'charLimit', parseInt(e.target.value) || 0)} placeholder="字数制限" className="w-20 rounded border border-input px-2 py-1 text-xs" />
                    <span className="text-xs text-gray-400">{q.answer.length}字</span>
                  </div>
                </div>
                <Textarea value={q.answer} onChange={e => update(q.id, 'answer', e.target.value)} placeholder="回答本文（個人情報は次のステップで自動検出・マスキングできます）" rows={5} className="text-sm leading-relaxed" />
                {q.charLimit && q.answer.length > q.charLimit && (
                  <p className="mt-1 text-xs text-red-500">字数制限超過（{q.answer.length}/{q.charLimit}字）</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={addQuestion} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
          <Plus className="h-4 w-4" />設問を追加
        </button>
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/submit/basic')}>← 戻る</Button>
          <Button variant="outline" onClick={() => updateDraft({ questions })}>下書き保存</Button>
        </div>
        <Button disabled={!canProceed} onClick={next}>次へ：証跡 →</Button>
      </div>
    </div>
  );
}
