import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CardMenu } from './card-menu.component';
import { useModalStore } from '@/store/modal.store';

interface CardProps {
  id: string;
  title: string;
  description: string;
}

export const Card: React.FC<CardProps> = ({ id, title, description }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const openModal = useModalStore((state) => state.openModal);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleView = () => {
    openModal('view_card', { id, title, description });
  };

  const handleUpdate = () => {
    openModal('update_card', { id, title, description });
    console.log('Update', id);
  };

  const handleDelete = () => {
    openModal('delete_card', { id, title });
  };

  return (
    <div className="relative" data-test-id={`card-${id}`}>
      <CardMenu
        cardId={id}
        onView={handleView}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
      <div
    ref={setNodeRef}
    style={style}
    {...attributes}
    {...listeners}
    className={`p-4 mb-2 rounded-lg shadow-sm bg-sakura cursor-grab select-none ${
      isDragging ? 'opacity-50' : 'opacity-100'
    } text-graphite max-w-[206px]`}
  >
    <p className="font-semibold pr-6 truncate overflow-ellipsis whitespace-nowrap">{title}</p>
  </div> 
    </div>
  );
};
