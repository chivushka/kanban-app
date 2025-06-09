export interface UpdateBoardProps {
  id: string;
  name?: string;
}

export interface DeleteBoardProps {
  id: string;
  name?: string;
}

export interface CardModalBaseProps {
  id: string;
  title: string;
  description: string;
}

export interface CreateCardProps {
  boardId: string;
}

export type ViewCardProps = CardModalBaseProps;

export type UpdateCardProps = CardModalBaseProps;

export interface DeleteCardProps {
  id: string;
  title?: string;
}
