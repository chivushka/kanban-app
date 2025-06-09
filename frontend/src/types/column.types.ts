import type { CardData } from './card.types';

export type ColumnsType = 'todo' | 'in_progress' | 'done';

export interface BoardColumns {
  [key: string]: CardData[];
}

export interface ColumnProps {
  id: string;
  title: string;
  cards: CardData[];
  setCards: (cards: CardData[]) => void;
}
