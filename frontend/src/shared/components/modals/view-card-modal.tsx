import React from 'react';
import { useModalStore } from '@/store/modal.store';
import type { ViewCardProps } from '@/types/modal.types';
import Button from '../button.component';

export const ViewCardModal: React.FC<ViewCardProps> = ({
  title,
  description,
}) => {
  const { closeModal } = useModalStore();

  return (
    <div className="space-y-4" data-testid="view-card-modal">
      <h2 className="text-xl font-semibold">Card details</h2>
      <div className="flex flex-col gap-2">
        <div>
          <span className="font-semibold">Title:</span>
          <div className="mt-1 p-2 rounded-lg bg-white/10 text-white">
            {title}
          </div>
        </div>
        <div>
          <span className="font-semibold">Description:</span>
          <div className="mt-1 p-2 rounded-lg bg-white/10 text-white min-h-[40px]">
            {description || (
              <span className="italic text-gray-400">No description</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          id="view-card-modal-close-button"
          text="Close"
          onClick={closeModal}
        />
      </div>
    </div>
  );
};
