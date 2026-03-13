'use client';

import { useRouter } from 'next/navigation';
import { useSubmitStore } from '@/stores/submitStore';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { industries, selectionTypeLabels, jobFamilyLabels, broadFieldLabels, academicLevelLabels, huFacultyLabels, huFacultiesUndergrad, huFacultiesGrad } from '@/lib/format';
import { SelectionType, JobFamily, AcademicLevel, BroadField, HUFaculty } from '@/features/posts/types';
import { generateId } from '@/lib/utils';

const schema = z.object({
  companyName: z.string().min(1, '企業名を入力してください'),
  industry: z.string().min(1, '業界を選択してください'),
  selectionType: z.enum(['internship', 'full_time'] as const),
  jobFamily: z.string().min(1, '職種を選択してください'),
  graduationYear: z.coerce.number().min(2020).max(2030),
  academicLevel: z.string().min(1, '学年を選択してください'),
  broadField: z.enum(['science', 'humanities', 'medical', 'education', 'other'] as const),
  faculty: z.string().optional(),
  title: z.string().min(1, 'タイトルを入力してください'),
  posterMemo: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function SubmitBasicPage() {
  const router = useRouter();
  const { draft, updateDraft } = useSubmitStore();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      companyName: draft.companyName ?? '',
      industry: draft.industry ?? '',
      selectionType: draft.selectionType ?? 'full_time',
      jobFamily: draft.jobFamily ?? '',
      graduationYear: draft.graduationYear ?? 2026,
      academicLevel: draft.academicLevel ?? 'B4',
      broadField: draft.broadField ?? 'science',
      faculty: draft.faculty ?? '',
      title: draft.title ?? '',
      posterMemo: draft.posterMemo ?? '',
    },
  });

  const selectClass = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const onSubmit: SubmitHandler<FormData> = (data) => {
    updateDraft({
      ...data,
      jobFamily: data.jobFamily as JobFamily,
      academicLevel: data.academicLevel as AcademicLevel,
      faculty: data.faculty ? data.faculty as HUFaculty : undefined,
      id: draft.id ?? generateId(),
      currentStep: 1,
    });
    router.push('/submit/questions');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-5">
        <h2 className="font-semibold text-gray-800">基本情報</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="companyName" className="mb-1 block text-sm font-medium">企業名 <span className="text-red-500">*</span></Label>
            <Input id="companyName" {...register('companyName')} placeholder="例：NTTデータ" />
            {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName.message}</p>}
          </div>
          <div>
            <Label htmlFor="industry" className="mb-1 block text-sm font-medium">業界 <span className="text-red-500">*</span></Label>
            <select id="industry" {...register('industry')} className={selectClass}>
              <option value="">選択してください</option>
              {industries.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            {errors.industry && <p className="mt-1 text-xs text-red-500">{errors.industry.message}</p>}
          </div>
          <div>
            <Label className="mb-1 block text-sm font-medium">選考種別 <span className="text-red-500">*</span></Label>
            <select {...register('selectionType')} className={selectClass}>
              {(Object.entries(selectionTypeLabels) as [SelectionType, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <Label className="mb-1 block text-sm font-medium">職種 <span className="text-red-500">*</span></Label>
            <select {...register('jobFamily')} className={selectClass}>
              <option value="">選択してください</option>
              {(Object.entries(jobFamilyLabels) as [JobFamily, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            {errors.jobFamily && <p className="mt-1 text-xs text-red-500">{errors.jobFamily.message}</p>}
          </div>
          <div>
            <Label className="mb-1 block text-sm font-medium">卒年 <span className="text-red-500">*</span></Label>
            <select {...register('graduationYear')} className={selectClass}>
              {[2024,2025,2026,2027,2028].map(y => <option key={y} value={y}>{y}卒</option>)}
            </select>
          </div>
          <div>
            <Label className="mb-1 block text-sm font-medium">学年 <span className="text-red-500">*</span></Label>
            <select {...register('academicLevel')} className={selectClass}>
              {(Object.entries(academicLevelLabels) as [AcademicLevel, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <Label className="mb-1 block text-sm font-medium">文理 <span className="text-red-500">*</span></Label>
            <select {...register('broadField')} className={selectClass}>
              {(Object.entries(broadFieldLabels) as [BroadField, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-1 block text-sm font-medium">学部・研究科（任意）</Label>
            <select {...register('faculty')} className={selectClass}>
              <option value="">選択しない</option>
              <optgroup label="── 学部 ──">
                {huFacultiesUndergrad.map(f => <option key={f} value={f}>{huFacultyLabels[f]}</option>)}
              </optgroup>
              <optgroup label="── 研究科 ──">
                {huFacultiesGrad.map(f => <option key={f} value={f}>{huFacultyLabels[f]}</option>)}
              </optgroup>
            </select>
            <p className="mt-1 text-xs text-gray-500">投稿カードに表示されます。入力しなくても投稿できます。</p>
          </div>
        </div>
        <div>
          <Label className="mb-1 block text-sm font-medium">投稿タイトル <span className="text-red-500">*</span></Label>
          <Input {...register('title')} placeholder="例：NTTデータ 2026卒 技術職 本選考 ES" />
          <p className="mt-1 text-xs text-gray-500">企業名・卒年・職種・選考種別を含めるとわかりやすいです</p>
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
        </div>
        <div>
          <Label className="mb-1 block text-sm font-medium">投稿者メモ（任意・公開されます）</Label>
          <Textarea {...register('posterMemo')} placeholder="選考のポイントや後輩へのアドバイスを書きましょう" rows={3} className="text-sm" />
        </div>
      </div>
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => updateDraft({ companyName: '' })}>下書き保存</Button>
        <Button type="submit">次へ：設問・回答 →</Button>
      </div>
    </form>
  );
}
