import React from 'react';
import { useModalStore, type ModalPropsAll } from '@/store/modal.store';
import { CreateBoardModal } from './create-board-modal';
import { UpdateBoardModal } from './update-board-modal';
import { DeleteBoardModal } from './delete-board-modal';
import CloseIcon from '@mui/icons-material/Close';
import Button from '../button.component';
import { CreateCardModal } from './create-card-modal';
import { DeleteCardModal } from './delete-card-modal';
import { UpdateCardModal } from './update-card-modal';
import { ViewCardModal } from './view-card-modal';

export const Modal: React.FC = () => {
  const { modalProps, modalType, closeModal } = useModalStore();

  if (!modalType) return null;

  const renderModalContent = () => {
    switch (modalType) {
      case 'create_board':
        return <CreateBoardModal />;
      case 'update_board':
        return (
          <UpdateBoardModal
            {...(modalProps as ModalPropsAll['update_board'])}
          />
        );
      case 'delete_board':
        return (
          <DeleteBoardModal
            {...(modalProps as ModalPropsAll['delete_board'])}
          />
        );
      case 'create_card':
        return (
          <CreateCardModal {...(modalProps as ModalPropsAll['create_card'])} />
        );
      case 'update_card':
        return (
          <UpdateCardModal {...(modalProps as ModalPropsAll['update_card'])} />
        );
      case 'delete_card':
        return (
          <DeleteCardModal {...(modalProps as ModalPropsAll['delete_card'])} />
        );
      case 'view_card':
        return (
          <ViewCardModal {...(modalProps as ModalPropsAll['view_card'])} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-d_gray text-l_sakura p-6 rounded-xl relative max-w-md w-full ">
        <div onClick={closeModal} className="absolute top-1 right-1">
          <Button icon={<CloseIcon />} variant={'transparent'} />
        </div>

        {renderModalContent()}
      </div>
    </div>
  );
};
