'use client';

import { useState } from 'react';
import { usePostStore } from '@/stores/postStore';
import { TakedownRequest } from '@/features/posts/types';
import { takedownTypeLabels } from '@/lib/format';
import { formatDate, generateId } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function AdminTakedownsPage() {
  const { takedowns, updateTakedown, addLog } = usePostStore();
  const [selected, setSelected] = useState<TakedownRequest | null>(null);
  const [note, setNote] = useState('');

  const sorted = [...takedowns].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleAction = (status: TakedownRequest['status']) => {
    if (!selected) return;
    const updated = { ...selected, status, adminNote: note, resolvedAt: new Date().toISOString() };
    updateTakedown(updated);
    addLog({ id: generateId(), operatorId: 'admin1', operatorName: '管理者A', targetId: selected.id, targetType: 'takedown', action: status === 'accepted' ? '削除依頼受理' : '削除依頼却下', meta: { postId: selected.postId }, createdAt: new Date().toISOString() });
    setSelected(null);
    setNote('');
  };

  const statusBadge = (s: TakedownRequest['status']) => ({
    pending: <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700">未対応</span>,
    accepted: <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">受理</span>,
    rejected: <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">却下</span>,
    resolved: <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">解決済み</span>,
  })[s];

  return (
    <div className="max-w-4xl space-y-4">
      <h1 className="text-xl font-bold text-gray-900">削除依頼管理</h1>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {sorted.map(t => (
            <div key={t.id} className="flex items-start gap-4 p-4 hover:bg-gray-50">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">{takedownTypeLabels[t.requestType]}</span>
                  {statusBadge(t.status)}
                </div>
                <p className="text-sm font-medium text-gray-800">{t.reason}</p>
                <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{t.detail}</p>
                <div className="mt-1 flex gap-3 text-xs text-gray-400">
                  <span>対象: {t.postUrl ?? t.postId ?? '不明'}</span>
                  <span>{formatDate(t.createdAt)}</span>
                </div>
              </div>
              <button onClick={() => { setSelected(t); setNote(t.adminNote ?? ''); }}
                className="shrink-0 rounded-md bg-purple-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-purple-700">
                対応
              </button>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={v => !v && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>削除依頼への対応</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 border p-3 text-sm space-y-1">
                <p><span className="text-gray-500">区分：</span>{takedownTypeLabels[selected.requestType]}</p>
                <p><span className="text-gray-500">理由：</span>{selected.reason}</p>
                <p className="text-gray-600">{selected.detail}</p>
                <p><span className="text-gray-500">連絡先：</span>{selected.contactEmail}</p>
              </div>
              <div>
                <Label className="mb-1 block text-sm font-medium">対応メモ</Label>
                <Textarea value={note} onChange={e => setNote(e.target.value)} rows={3} className="text-sm" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => handleAction('rejected')}>却下</Button>
                <Button className="flex-1" onClick={() => handleAction('accepted')}>受理する</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
