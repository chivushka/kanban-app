import React, { useState } from 'react';
import { useModalStore } from '@/store/modal.store';
import { useToastStore } from '@/store/toast.store';
import Input from '../input.component';
import Button from '../button.component';
import type { CreateCardProps } from '@/types/modal.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cardService } from '@/shared/services/card.service';
import { QUERY_KEYS } from '@/shared/keys';

export const CreateCardModal: React.FC<CreateCardProps> = ({ boardId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { closeModal } = useModalStore();
  const showToast = useToastStore((state) => state.showToast);
  const queryClient = useQueryClient();

  const createCardMutation = useMutation({
    mutationFn: () =>
      cardService.create(boardId, {
        title: title.trim(),
        description: description.trim(),
        column: 'todo',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CARD, boardId] });
      closeModal();
      showToast('Card created successfully!', 'success');
    },
    onError: (error) => {
      console.error('Create card error:', error);
      showToast('Card creation failed :(', 'error');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createCardMutation.mutate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      data-testid="create-card-modal"
    >
      <h2 className="text-xl  font-semibold">Create a new card</h2>

      <div className="flex flex-col gap-2">
        <Input
          id="title"
          label="Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
        />
        <Input
          id="description"
          label="Description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button text="Cancel" onClick={closeModal} variant={'transparent'} />
        <Button
          id="create-card-modal-create-button"
          type={'submit'}
          text="Create"
          loading={createCardMutation.isPending}
        />
      </div>
    </form>
  );
};
