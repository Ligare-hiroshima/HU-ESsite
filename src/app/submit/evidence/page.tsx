'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSubmitStore } from '@/stores/submitStore';
import { Button } from '@/components/ui/button';
import { EvidenceFile } from '@/features/posts/types';
import { generateId } from '@/lib/utils';
import { fileSizeLabel } from '@/lib/format';
import { FileText, Upload, Trash2, Lock } from 'lucide-react';

interface FileItem { file: File; meta: EvidenceFile; }

export default function SubmitEvidencePage() {
  const router = useRouter();
  const { updateDraft } = useSubmitStore();
  const [submission, setSubmission] = useState<FileItem[]>([]);
  const [result, setResult] = useState<FileItem[]>([]);

  const addFiles = (e: React.ChangeEvent<HTMLInputElement>, type: 'submission' | 'result') => {
    const files = Array.from(e.target.files ?? []).map(f => ({
      file: f,
      meta: { id: generateId(), fileName: f.name, fileSize: f.size, mimeType: f.type, fileType: type, uploadedAt: new Date().toISOString() } as EvidenceFile,
    }));
    if (type === 'submission') setSubmission(p => [...p, ...files]);
    else setResult(p => [...p, ...files]);
    e.target.value = '';
  };

  const next = () => {
    updateDraft({ evidenceFiles: [...submission.map(f => f.meta), ...result.map(f => f.meta)], currentStep: 3 });
    router.push('/submit/masking');
  };

  const FileRow = ({ item, onRemove }: { item: FileItem; onRemove: () => void }) => (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
      <FileText className="h-8 w-8 shrink-0 text-gray-300" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-700">{item.meta.fileName}</p>
        <p className="text-xs text-gray-400">{fileSizeLabel(item.meta.fileSize)}</p>
      </div>
      <button onClick={onRemove} className="text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
    </div>
  );

  const DropZone = ({ type, files, title, desc }: { type: 'submission'|'result'; files: FileItem[]; title: string; desc: string }) => (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 mb-3">{desc}</p>
      <div className="space-y-2 mb-3">
        {files.map(f => <FileRow key={f.meta.id} item={f} onRemove={() => type === 'submission' ? setSubmission(p => p.filter(x => x.meta.id !== f.meta.id)) : setResult(p => p.filter(x => x.meta.id !== f.meta.id))} />)}
      </div>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors">
        <Upload className="h-6 w-6 text-gray-300 mb-1" />
        <p className="text-sm text-gray-600">ファイルを選択（PDF / PNG / JPG）</p>
        <input type="file" accept=".pdf,.png,.jpg,.jpeg" multiple className="hidden" onChange={e => addFiles(e, type)} />
      </label>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-2">
        <Lock className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-800"><span className="font-medium">証跡は公開されません。</span>運営の審査にのみ使用されます。</p>
      </div>
      <DropZone type="submission" files={submission} title="提出本文の証跡" desc="実際に提出したESのPDF・スクリーンショット" />
      <DropZone type="result" files={result} title="通過証跡（推奨）" desc="選考通過メール・マイページのスクリーンショット。あると審査が早くなります" />
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.push('/submit/questions')}>← 戻る</Button>
        <Button onClick={next}>次へ：マスキング確認 →</Button>
      </div>
    </div>
  );
}
