import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NoteTag } from '@/types/note';

type Draft = {
    title: string;
    content: string;
    tag: NoteTag;
}

export const initialDraft:Draft = {
    title: '',
    content: '',
    tag: 'Todo',
};

type NoteStore = {
    draft: Draft;
    setDraft: (draft: Partial<Draft>) => void;
    clearDraft: () => void;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,

      setDraft: (data) =>
        set((state) => ({
          draft: {
            ...state.draft,
            ...data,
          },
        })),

      clearDraft: () =>
        set({
          draft: initialDraft,
        }),
    }),
    {
      name: 'note-draft',

      partialize: (state) => ({
        draft: state.draft,
      }),
    }
  )
);
