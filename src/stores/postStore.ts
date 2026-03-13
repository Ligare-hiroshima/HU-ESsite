import { create } from 'zustand';
import { Post, Report, TakedownRequest, ModerationLog } from '@/features/posts/types';
import { mockPosts } from '@/mocks/data/posts';
import { mockReports } from '@/mocks/data/reports';
import { mockTakedowns } from '@/mocks/data/takedowns';
import { mockLogs } from '@/mocks/data/logs';

interface PostState {
  posts: Post[];
  reports: Report[];
  takedowns: TakedownRequest[];
  logs: ModerationLog[];
  initialized: boolean;
  initialize: () => void;
  updatePost: (post: Post) => void;
  addPost: (post: Post) => void;
  addReport: (report: Report) => void;
  addTakedown: (takedown: TakedownRequest) => void;
  addLog: (log: ModerationLog) => void;
  updateReport: (report: Report) => void;
  updateTakedown: (takedown: TakedownRequest) => void;
}

const STORAGE_KEY = 'hu-es-store';

function loadFromStorage(): Partial<PostState> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToStorage(state: Partial<PostState>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: mockPosts,
  reports: mockReports,
  takedowns: mockTakedowns,
  logs: mockLogs,
  initialized: false,

  initialize: () => {
    const stored = loadFromStorage();
    if (stored) {
      set({
        posts: stored.posts ?? mockPosts,
        reports: stored.reports ?? mockReports,
        takedowns: stored.takedowns ?? mockTakedowns,
        logs: stored.logs ?? mockLogs,
        initialized: true,
      });
    } else {
      set({ initialized: true });
    }
  },

  updatePost: (post) => {
    set((state) => {
      const posts = state.posts.map((p) => (p.id === post.id ? post : p));
      saveToStorage({ ...get(), posts });
      return { posts };
    });
  },

  addPost: (post) => {
    set((state) => {
      const posts = [...state.posts, post];
      saveToStorage({ ...get(), posts });
      return { posts };
    });
  },

  addReport: (report) => {
    set((state) => {
      const reports = [...state.reports, report];
      saveToStorage({ ...get(), reports });
      return { reports };
    });
  },

  addTakedown: (takedown) => {
    set((state) => {
      const takedowns = [...state.takedowns, takedown];
      saveToStorage({ ...get(), takedowns });
      return { takedowns };
    });
  },

  addLog: (log) => {
    set((state) => {
      const logs = [...state.logs, log];
      saveToStorage({ ...get(), logs });
      return { logs };
    });
  },

  updateReport: (report) => {
    set((state) => {
      const reports = state.reports.map((r) => (r.id === report.id ? report : r));
      saveToStorage({ ...get(), reports });
      return { reports };
    });
  },

  updateTakedown: (takedown) => {
    set((state) => {
      const takedowns = state.takedowns.map((t) => (t.id === takedown.id ? takedown : t));
      saveToStorage({ ...get(), takedowns });
      return { takedowns };
    });
  },
}));
