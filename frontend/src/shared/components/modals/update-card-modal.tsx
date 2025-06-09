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
  const [cardTitle, setCardTitle] = useState(title ?? '');
  const [cardDescription, setCardDescription] = useState(description ?? '');
  const { closeModal } = useModalStore();
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);
  const boardId = useBoardStore((state) => state.boardId);

  const updateCardMutation = useMutation({
    mutationFn: () =>
      cardService.update(boardId, id, {
        title: cardTitle.trim(),
        description: cardDescription.trim(),
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
    if (!cardTitle.trim()) return;
    if (
      cardTitle.trim() === (title ?? '').trim() &&
      cardDescription.trim() === (description ?? '').trim()
    ) {
      closeModal();
      return;
    }
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
          value={cardTitle}
          onChange={(e) => setCardTitle(e.target.value)}
          placeholder="Enter title"
        />
        <Input
          id="description"
          label="Description"
          type="text"
          value={cardDescription}
          onChange={(e) => setCardDescription(e.target.value)}
          placeholder="Enter description"
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
