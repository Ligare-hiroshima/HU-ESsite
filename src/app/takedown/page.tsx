'use client';

import { useState } from 'react';
import { usePostStore } from '@/stores/postStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TakedownRequestType } from '@/features/posts/types';
import { takedownTypeLabels } from '@/lib/format';
import { generateId } from '@/lib/utils';
import { CheckCircle2, Upload, Trash2 } from 'lucide-react';

const schema = z.object({
  postUrl: z.string().min(1, '投稿URLまたはIDを入力してください'),
  requestType: z.enum(['poster_self', 'third_party', 'company', 'other'] as const),
  reason: z.string().min(1, '理由を選択してください'),
  detail: z.string().min(10, '詳細を10字以上で記入してください'),
  contactEmail: z.string().email('有効なメールアドレスを入力してください'),
});
type FormData = z.infer<typeof schema>;

const reasons = ['投稿者本人からの削除希望','個人情報が含まれている','第三者の権利侵害','虚偽内容の疑い','企業からの依頼','その他'];

export default function TakedownPage() {
  const { addTakedown } = usePostStore();
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const selectClass = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { requestType: 'poster_self' },
  });

  const onSubmit = (data: FormData) => {
    addTakedown({ id: generateId(), postUrl: data.postUrl, requestType: data.requestType, reason: data.reason, detail: data.detail, contactEmail: data.contactEmail, status: 'pending', createdAt: new Date().toISOString() });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-green-500 mb-4" />
        <h1 className="text-xl font-bold text-gray-900">削除依頼を受け付けました</h1>
        <p className="mt-2 text-sm text-gray-500">運営が内容を確認の上、対応いたします。数営業日かかる場合があります。</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">削除依頼フォーム</h1>
        <p className="mt-1 text-sm text-gray-500">投稿の削除を希望される場合はこちらからお申請ください</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
          <div>
            <Label className="mb-1 block text-sm font-medium">対象投稿のURLまたはID *</Label>
            <Input {...register('postUrl')} placeholder="例：/posts/p1 または p1" />
            {errors.postUrl && <p className="mt-1 text-xs text-red-500">{errors.postUrl.message}</p>}
          </div>
          <div>
            <Label className="mb-2 block text-sm font-medium">依頼者区分 *</Label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(takedownTypeLabels) as [TakedownRequestType, string][]).map(([k, v]) => (
                <label key={k} className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 p-3 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                  <input type="radio" {...register('requestType')} value={k} className="accent-blue-600" /><span className="text-sm">{v}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-1 block text-sm font-medium">削除理由 *</Label>
            <select {...register('reason')} className={selectClass}>
              <option value="">選択してください</option>
              {reasons.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            {errors.reason && <p className="mt-1 text-xs text-red-500">{errors.reason.message}</p>}
          </div>
          <div>
            <Label className="mb-1 block text-sm font-medium">詳細説明 *</Label>
            <Textarea {...register('detail')} rows={4} placeholder="削除を希望する具体的な理由・状況を記入してください" className="text-sm" />
            {errors.detail && <p className="mt-1 text-xs text-red-500">{errors.detail.message}</p>}
          </div>
          <div>
            <Label className="mb-1 block text-sm font-medium">連絡先メールアドレス *</Label>
            <Input {...register('contactEmail')} type="email" placeholder="your@example.com" />
            {errors.contactEmail && <p className="mt-1 text-xs text-red-500">{errors.contactEmail.message}</p>}
          </div>
          <div>
            <Label className="mb-1 block text-sm font-medium">添付資料（任意）</Label>
            <div className="space-y-2 mb-2">
              {files.map((f, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm">
                  <span className="truncate text-gray-700">{f.name}</span>
                  <button type="button" onClick={() => setFiles(p => p.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              ))}
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-gray-200 px-4 py-3 text-sm text-gray-500 hover:border-blue-400 hover:bg-blue-50">
              <Upload className="h-4 w-4" />ファイルを添付
              <input type="file" multiple className="hidden" onChange={e => { setFiles(p => [...p, ...Array.from(e.target.files ?? [])]); e.target.value = ''; }} />
            </label>
          </div>
        </div>
        <Button type="submit" className="w-full">削除依頼を送信する</Button>
      </form>
    </div>
  );
}
