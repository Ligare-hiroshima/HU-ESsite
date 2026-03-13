'use client';

import { useViewerModeStore } from '@/stores/viewerModeStore';
import { UserMode } from '@/features/posts/types';

const modes: { value: UserMode; label: string; color: string }[] = [
  { value: 'viewer', label: '閲覧', color: 'bg-blue-100 text-blue-700 ring-blue-300' },
  { value: 'poster', label: '投稿者', color: 'bg-emerald-100 text-emerald-700 ring-emerald-300' },
  { value: 'admin', label: '管理者', color: 'bg-purple-100 text-purple-700 ring-purple-300' },
];

export function ModeToggle() {
  const { mode, setMode } = useViewerModeStore();

  return (
    <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1">
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => setMode(m.value)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
            mode === m.value
              ? `${m.color} ring-1 shadow-sm`
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
