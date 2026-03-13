import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SelectionType, JobFamily, AcademicLevel, BroadField, HUFaculty, PostQuestionItem, EvidenceFile } from '@/features/posts/types';

export interface DraftPost {
  id?: string;
  title?: string;
  companyName?: string;
  industry?: string;
  selectionType?: SelectionType;
  jobFamily?: JobFamily;
  graduationYear?: number;
  academicLevel?: AcademicLevel;
  broadField?: BroadField;
  faculty?: HUFaculty;
  posterMemo?: string;
  questions: PostQuestionItem[];
  evidenceFiles: EvidenceFile[];
  currentStep: number;
}

interface SubmitState {
  draft: DraftPost;
  updateDraft: (partial: Partial<DraftPost>) => void;
  resetDraft: () => void;
}

const initialDraft: DraftPost = {
  questions: [],
  evidenceFiles: [],
  currentStep: 0,
};

export const useSubmitStore = create<SubmitState>()(
  persist(
    (set) => ({
      draft: initialDraft,
      updateDraft: (partial) => set((state) => ({ draft: { ...state.draft, ...partial } })),
      resetDraft: () => set({ draft: initialDraft }),
    }),
    { name: 'hu-es-draft' }
  )
);
