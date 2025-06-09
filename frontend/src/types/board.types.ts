export type Board = {
  id: string;
  hashId: string;
  name: string;
};

export type BoardGetAllResponse = Board[];

export type BoardCreateDto = {
  name: string;
};

export type BoardUpdateDto = BoardCreateDto;

export type ColumnId = 'todo' | 'in_progress' | 'done';

export interface BoardState {
  todo: string[];
  in_progress: string[];
  done: string[];
  cards: Record<string, { id: string; title: string }>;
}
