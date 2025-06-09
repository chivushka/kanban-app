import React, { useState } from 'react';
import { useModalStore } from '@/store/modal.store';
import Input from '../input.component';
import Button from '../button.component';
import type { UpdateCardProps } from '@/types/modal.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cardService } from '@/shared/services/card.service';
import { QUERY_KEYS } from '@/shared/keys';
import { useToastStore } from '@/store/toast.store';
import { useBoardStore } from '@/store/board.store';

export const UpdateCardModal: React.FC<UpdateCardProps> = ({
  id,
  title,
  description,
}) => {
  const [newTitle, setNewTitle] = useState(title ?? '');
  const [newDescription, setNewDescription] = useState(description ?? '');
  const { closeModal } = useModalStore();
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);
  const boardId = useBoardStore((state) => state.boardId);

  const updateCardMutation = useMutation({
    mutationFn: () =>
      cardService.update(boardId, id, {
        title: newTitle.trim(),
        description: newDescription.trim(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CARD, boardId] });
      closeModal();
      showToast('Card updated successfully :)', 'success');
    },
    onError: (error) => {
      console.error('Update card error:', error);
      showToast('Card update failed :(', 'error');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim())
      return showToast('Card details should not be empty', 'info');
    updateCardMutation.mutate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      data-testid="update-card-modal"
    >
      <h2 className="text-xl font-semibold">Update a card</h2>

      <div className="flex flex-col gap-2">
        <Input
          id="title"
          label="Title"
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Enter title"
          required
        />
        <Input
          id="description"
          label="Description"
          type="text"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Enter description"
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button text="Cancel" onClick={closeModal} variant={'transparent'} />
        <Button
          id="update-card-modal-update-button"
          type={'submit'}
          text="Update"
          loading={updateCardMutation.isPending}
        />
      </div>
    </form>
  );
};
