import React from 'react';
import { useModalStore } from '@/store/modal.store';
import Button from '../button.component';
import type { DeleteCardProps } from '@/types/modal.types';
import { cardService } from '@/shared/services/card.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/keys';
import { useToastStore } from '@/store/toast.store';
import { useBoardStore } from '@/store/board.store';

export const DeleteCardModal: React.FC<DeleteCardProps> = ({ id, title }) => {
  const { closeModal } = useModalStore();
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);
  const boardId = useBoardStore((state) => state.boardId);

  const mutation = useMutation({
    mutationFn: () => cardService.delete(boardId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CARD, boardId] });
      closeModal();
      showToast('Card is deleted successfully.', 'success');
    },
    onError: () => {
      showToast('Failed to delete card :(', 'error');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      data-testid="delete-card-modal"
    >
      <div className="text-white select-none mt-5">
        {`Are you sure you want to delete the card${title ? ` with\n title - "${title}"` : ''}?`}
      </div>

      <div className="flex justify-end space-x-2">
        <Button text="Cancel" onClick={closeModal} variant={'transparent'} />
        <Button
          id="delete-card-modal-submit-button"
          text="Submit"
          type="submit"
        />
      </div>
    </form>
  );
};
