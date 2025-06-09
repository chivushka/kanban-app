import React, { useState } from 'react';
import { useModalStore } from '@/store/modal.store';
import Input from '../input.component';
import Button from '../button.component';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { BoardCreateDto } from '@/types/board.types';
import { boardService } from '@/shared/services/board.service';
import { QUERY_KEYS } from '@/shared/keys';
import { useToastStore } from '@/store/toast.store';

export const CreateBoardModal: React.FC = () => {
  const [name, setName] = useState('');
  const { closeModal } = useModalStore();
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  const createBoardMutation = useMutation({
    mutationFn: (dto: BoardCreateDto) => boardService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOARD] });
      closeModal();
      showToast('Board created successfully :)', 'success');
    },
    onError: (error) => {
      console.error('Create board error:', error);
      showToast('Board creation failed :(', 'error');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return showToast('Board name should not be empty', 'info');

    createBoardMutation.mutate({ name });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      data-testid="create-board-modal"
    >
      <h2 className="text-xl  font-semibold">Create a new board</h2>

      <div className="flex flex-col">
        <Input
          id="create-board-modal-name-input"
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button text="Cancel" onClick={closeModal} variant={'transparent'} />
        <Button
          id="create-board-modal-create-button"
          type={'submit'}
          text="Create"
          loading={createBoardMutation.isPending}
        />
      </div>
    </form>
  );
};
