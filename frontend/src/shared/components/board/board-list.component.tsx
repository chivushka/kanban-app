import React from 'react';
import BoardListItem from './board-list-item.component';
import { useBoards } from '@/hooks/useBoards';
import { useNavigate } from 'react-router-dom';

const BoardList: React.FC = () => {
  const navigate = useNavigate();
  const { data: boards, isLoading, error } = useBoards();
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading boards: {error.message}</p>;
  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <ul className="space-y-2">
        {boards?.map((board) => (
          <BoardListItem
            key={board.id}
            board={board}
            onClick={() =>
              navigate(`/board/${board.hashId}`, {
                state: {
                  id: board.id,
                  name: board.name,
                },
              })
            }
          />
        ))}
      </ul>
    </div>
  );
};

export default BoardList;
