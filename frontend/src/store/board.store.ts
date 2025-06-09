import { create } from 'zustand';

interface BoardState {
  boardId: string;
  setBoardId: (id: string) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  boardId: '',
  setBoardId: (id) => set({ boardId: id }),
}));
