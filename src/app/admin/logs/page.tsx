'use client';

import { usePostStore } from '@/stores/postStore';
import { formatDateTime } from '@/lib/utils';

export default function AdminLogsPage() {
  const { logs } = usePostStore();
  const sorted = [...logs].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const actionColor = (action: string) => {
    if (action.includes('承認')) return 'bg-green-100 text-green-700';
    if (action.includes('却下')) return 'bg-red-100 text-red-700';
    if (action.includes('差し戻し')) return 'bg-orange-100 text-orange-700';
    if (action.includes('受理')) return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="max-w-4xl space-y-4">
      <h1 className="text-xl font-bold text-gray-900">監査ログ</h1>
      <p className="text-sm text-gray-500">{sorted.length}件のログ</p>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {sorted.map(log => (
            <div key={log.id} className="flex items-start gap-4 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${actionColor(log.action)}`}>{log.action}</span>
                  <span className="text-xs text-gray-500">{log.operatorName}</span>
                </div>
                <p className="text-xs text-gray-600">
                  対象: <span className="font-mono">{log.targetId}</span>（{log.targetType}）
                </p>
                {log.meta && Object.keys(log.meta).length > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5 font-mono">
                    {JSON.stringify(log.meta)}
                  </p>
                )}
              </div>
              <span className="shrink-0 text-xs text-gray-400 whitespace-nowrap">{formatDateTime(log.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
