'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ReportReason } from '@/features/posts/types';
import { reportReasonLabels } from '@/lib/format';
import { usePostStore } from '@/stores/postStore';
import { generateId } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  postId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const reasons: ReportReason[] = ['personal_info', 'false_content', 'inappropriate', 'rights_violation', 'other'];

export function ReportModal({ postId, open, onOpenChange }: Props) {
  const { addReport } = usePostStore();
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [detail, setDetail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedReason) return;
    addReport({
      id: generateId(),
      postId,
      reason: selectedReason,
      detail,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    setSubmitted(true);
  };

  const handleClose = (v: boolean) => {
    if (!v) {
      setSelectedReason(null);
      setDetail('');
      setSubmitted(false);
    }
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>この投稿を通報する</DialogTitle>
        </DialogHeader>
        {submitted ? (
          <div className="flex flex-col items-center py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-3" />
            <p className="font-medium text-gray-900">通報を受け付けました</p>
            <p className="mt-1 text-sm text-gray-500">運営が内容を確認し、適切に対応します。</p>
            <Button className="mt-4" onClick={() => handleClose(false)}>閉じる</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block text-sm font-medium">通報理由</Label>
              <div className="space-y-2">
                {reasons.map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedReason(r)}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                      selectedReason === r
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {reportReasonLabels[r]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="detail" className="mb-1 block text-sm font-medium">詳細（任意）</Label>
              <Textarea
                id="detail"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="具体的な問題箇所や詳細を記入してください"
                rows={3}
                className="text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => handleClose(false)}>キャンセル</Button>
              <Button disabled={!selectedReason} onClick={handleSubmit} variant="destructive">
                通報する
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
