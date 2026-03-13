'use client';

import { useState } from 'react';
import { usePostStore } from '@/stores/postStore';
import { Report } from '@/features/posts/types';
import { reportReasonLabels } from '@/lib/format';
import { formatDate, generateId } from '@/lib/utils';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

export default function AdminReportsPage() {
  const { reports, updateReport, posts, addLog } = usePostStore();
  const [selected, setSelected] = useState<Report | null>(null);
  const [note, setNote] = useState('');

  const sorted = [...reports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleAction = (status: Report['status']) => {
    if (!selected) return;
    const updated = { ...selected, status, reviewedAt: new Date().toISOString(), reviewNote: note };
    updateReport(updated);
    addLog({ id: generateId(), operatorId: 'admin1', operatorName: '管理者A', targetId: selected.id, targetType: 'report', action: status === 'resolved' ? '通報解決' : '通報却下', meta: { postId: selected.postId }, createdAt: new Date().toISOString() });
    setSelected(null);
    setNote('');
  };

  const statusLabel = (s: Report['status']) => ({
    pending: <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700">未対応</span>,
    reviewed: <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">確認済み</span>,
    resolved: <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">対応完了</span>,
    dismissed: <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">却下</span>,
  })[s];

  return (
    <div className="max-w-4xl space-y-4">
      <h1 className="text-xl font-bold text-gray-900">通報管理</h1>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {sorted.map(report => {
            const post = posts.find(p => p.id === report.postId);
            return (
              <div key={report.id} className="flex items-start gap-4 p-4 hover:bg-gray-50">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">{reportReasonLabels[report.reason]}</span>
                    {statusLabel(report.status)}
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{report.detail || '（詳細なし）'}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                    <span>対象: {post ? post.companyName : report.postId}</span>
                    <span>{formatDate(report.createdAt)}</span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  {post && (
                    <Link href={`/posts/${post.id}`} className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
                      <Eye className="h-3 w-3" />投稿
                    </Link>
                  )}
                  <button onClick={() => { setSelected(report); setNote(report.reviewNote ?? ''); }}
                    className="rounded-md bg-purple-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-purple-700">
                    対応
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={v => !v && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>通報への対応</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 border p-3 text-sm">
                <p className="font-medium text-gray-700">{reportReasonLabels[selected.reason]}</p>
                <p className="mt-1 text-gray-600">{selected.detail}</p>
              </div>
              <div>
                <Label className="mb-1 block text-sm font-medium">対応メモ</Label>
                <Textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="対応内容を記録してください" className="text-sm" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => handleAction('dismissed')}>却下</Button>
                <Button className="flex-1" onClick={() => handleAction('resolved')}>解決済みにする</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
