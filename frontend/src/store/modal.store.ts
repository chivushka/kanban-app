import type {
  CreateCardProps,
  DeleteBoardProps,
  DeleteCardProps,
  UpdateBoardProps,
  UpdateCardProps,
  ViewCardProps,
} from '@/types/modal.types';
import { create } from 'zustand';

export type ModalType =
  | 'create_board'
  | 'update_board'
  | 'delete_board'
  | 'view_card'
  | 'create_card'
  | 'update_card'
  | 'delete_card'
  | null;

export type ModalPropsAll = {
  create_board: undefined;
  update_board: UpdateBoardProps;
  delete_board: DeleteBoardProps;

  view_card: ViewCardProps;
  create_card: CreateCardProps;
  update_card: UpdateCardProps;
  delete_card: DeleteCardProps;
};

interface ModalState<T extends ModalType = ModalType> {
  modalType: T;
  modalProps: T extends keyof ModalPropsAll ? ModalPropsAll[T] | null : null;
  openModal: <K extends keyof ModalPropsAll>(
    type: K,
    props: ModalPropsAll[K] extends undefined ? undefined : ModalPropsAll[K],
  ) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modalType: null,
  modalProps: null,
  openModal: (type, props) =>
    set({ modalType: type, modalProps: props ?? null }),
  closeModal: () => set({ modalType: null, modalProps: null }),
}));
