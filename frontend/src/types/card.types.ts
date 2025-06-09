import type { ColumnId } from './board.types';

export type CardData = {
  id: string;
  title: string;
  description: string;
  column: ColumnId;
};

export type CardGetAllResponse = CardData[];

export type CardCreateDto = {
  title: string;
  description: string;
  column: ColumnId;
};

export type CardUpdateDto = Partial<Omit<CardCreateDto, 'column'>> & {
  column?: ColumnId;
};

export type CardMoveDto = {
  column: ColumnId;
  order: number;
};
