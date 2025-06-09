import React from 'react';
import { useModalStore } from '@/store/modal.store';
import Button from '../button.component';
import type { DeleteBoardProps } from '@/types/modal.types';
import { boardService } from '@/shared/services/board.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/keys';
import { useToastStore } from '@/store/toast.store';

export const DeleteBoardModal: React.FC<DeleteBoardProps> = ({ id, name }) => {
  const { closeModal } = useModalStore();
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  const mutation = useMutation({
    mutationFn: (idToDelete: string) => boardService.delete(idToDelete),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOARD] });
      closeModal();
      showToast(`Board is deleted successfully.`, 'success');
    },
    onError: () => {
      showToast('Failed to delete board :(', 'error');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(id);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      data-testid="delete-board-modal"
    >
      <div className="text-white select-none mt-5">
        Are you sure you want to delete a board with name - "{name}"?
      </div>

      <div className="flex justify-end space-x-2">
        <Button text="Cancel" onClick={closeModal} variant={'transparent'} />
        <Button
          id="delete-board-modal-submit-button"
          text="Submit"
          type="submit"
        />
      </div>
    </form>
  );
};
