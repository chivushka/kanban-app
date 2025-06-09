import React, { useState } from 'react';
import { useModalStore } from '@/store/modal.store';
import Input from '../input.component';
import Button from '../button.component';
import type { UpdateBoardProps } from '@/types/modal.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { boardService } from '@/shared/services/board.service';
import { QUERY_KEYS } from '@/shared/keys';
import { useToastStore } from '@/store/toast.store';

export const UpdateBoardModal: React.FC<UpdateBoardProps> = ({ id, name }) => {
  const [boardNameInput, setBoardNameInput] = useState(name ?? '');
  const { closeModal } = useModalStore();
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  const updateBoardMutation = useMutation({
    mutationFn: () => boardService.update(id, { name: boardNameInput.trim() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOARD] });
      closeModal();
      showToast('Board updated successfully :)', 'success');
    },
    onError: (error) => {
      console.error('Update board error:', error);
      showToast('Board update failed :(', 'error');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!boardNameInput.trim()) return;
    if (boardNameInput.trim() === (name ?? '').trim()) {
      closeModal();
      return;
    }

    updateBoardMutation.mutate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      data-testid="update-board-modal"
    >
      <h2 className="text-xl font-semibold">Update a board</h2>

      <div className="flex flex-col">
        <Input
          id="update-board-modal-name-input"
          label="Name"
          type="text"
          value={boardNameInput}
          onChange={(e) => setBoardNameInput(e.target.value)}
          placeholder="Enter name"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button text="Cancel" onClick={closeModal} variant={'transparent'} />
        <Button
          id="update-board-modal-update-button"
          type={'submit'}
          text="Update"
          loading={updateBoardMutation.isPending}
        />
      </div>
    </form>
  );
};
