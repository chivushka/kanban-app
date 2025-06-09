import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card } from './card.component';
import Button from '../button.component';
import AddIcon from '@mui/icons-material/Add';
import type { ColumnProps } from '@/types/column.types';
import { useModalStore } from '@/store/modal.store';
import { useBoardStore } from '@/store/board.store';

export const Column: React.FC<ColumnProps> = ({ id, title, cards }) => {
  const { setNodeRef } = useDroppable({ id });
  const openModal = useModalStore((state) => state.openModal);
  const boardId = useBoardStore((state) => state.boardId);

  const handleAddCard = () => {
    openModal('create_card', { boardId });
  };

  return (
    <div className="relative bg-d_gray rounded-lg p-8 min-w-[270px] flex flex-col min-h-[250px]">
      <h2 className="text-white font-poppins font-bold mb-4">{title}</h2>
      {id === 'todo' && (
        <div className="absolute top-2 right-2 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition">
          <Button
            id="add-card-button"
            icon={<AddIcon />}
            variant={'transparent'}
            onClick={handleAddCard}
          />
        </div>
      )}

      <SortableContext
        items={cards.map((card) => card.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          id={`column-${id}`}
          data-testid={`column-${id}`}
          className="min-h-[150px] flex flex-col gap-2 flex-1 h-full"
        >
          {cards.length > 0 ? (
            cards.map((card) => (
              <Card
                key={card.id}
                id={card.id}
                title={card.title}
                description={card.description}
              />
            ))
          ) : (
            <div className="flex-1 h-full min-h-[150px] flex items-center justify-center rounded border-2 border-dashed border-l_gray">
              <p className="text-l_gray text-center">{id === 'todo' ? "Add by +\nor drop here" :"Drop here"}</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};
