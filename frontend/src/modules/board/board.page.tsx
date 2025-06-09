import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BoardDndContext } from '@/shared/components/board/board-dnd-context.component';
import { Header } from '@/shared/components/header.component';
import { useBoardStore } from '@/store/board.store';

const BoardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, name } = location.state || { id: '', name: '' };

  const setBoardId = useBoardStore((state) => state.setBoardId);
  React.useEffect(() => {
    if (id) setBoardId(id);
  }, [id, setBoardId]);

  return (
    <div
      className="min-h-screen bg-graphite flex flex-col"
      data-testid="board-page"
    >
      <Header
        title={name || 'Undefined Board'}
        onBack={() => navigate('/')}
        backText="Back to Home"
      />

      {id && name ? (
        <div className="min-h-[80vh] flex gap-6 p-6 items-start self-start overflow-x-auto">
          <div className="flex gap-6 min-w-max self-start">
            <BoardDndContext />
          </div>
        </div>
      ) : (
        <div className=" text-white mt-10 text-lg self-center">{`It's a pity, but this board is not found`}</div>
      )}
    </div>
  );
};

export default BoardPage;
