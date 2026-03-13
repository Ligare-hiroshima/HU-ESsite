import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserMode } from '@/features/posts/types';

interface ViewerModeState {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
}

export const useViewerModeStore = create<ViewerModeState>()(
  persist(
    (set) => ({
      mode: 'viewer',
      setMode: (mode) => set({ mode }),
    }),
    { name: 'viewer-mode' }
  )
);
