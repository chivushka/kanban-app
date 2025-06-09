import type { Board } from '@/types/board.types';
import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useModalStore } from '@/store/modal.store';

type BoardListItemProps = {
  board: Board;
  onClick?: (id: string) => void;
};

const BoardListItem: React.FC<BoardListItemProps> = ({ board, onClick }) => {
  const openModal = useModalStore((state) => state.openModal);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal('update_board', {
      id: board.id,
      name: board.name,
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal('delete_board', {
      id: board.id,
      name: board.name,
    });
  };

  return (
    <li
      className="p-3 rounded-lg bg-sakura hover:bg-l_sakura cursor-pointer flex items-center justify-between"
      onClick={() => onClick?.(board.id)}
      data-testid={`board-item-${board.hashId}`}
    >
      <span>{board.name}</span>
      <div className="flex gap-2">
        <EditIcon
          data-testid={`edit-board-icon-${board.hashId}`}
          className="text-graphite hover:text-l_gray cursor-pointer"
          fontSize="small"
          onClick={handleEdit}
        />
        <DeleteIcon
          data-testid={`delete-board-icon-${board.hashId}`}
          className="text-graphite hover:text-error cursor-pointer"
          fontSize="small"
          onClick={handleDelete}
        />
      </div>
    </li>
  );
};

export default BoardListItem;
