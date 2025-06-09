import BoardList from '@/shared/components/board/board-list.component';
import Button from '@/shared/components/button.component';
import Input from '@/shared/components/input.component';
import { boardService } from '@/shared/services/board.service';
import { useModalStore } from '@/store/modal.store';
import { useToastStore } from '@/store/toast.store';
import { useMutation } from '@tanstack/react-query';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/shared/components/header.component';

export const HomePage: React.FC = () => {
  const [boardId, setBoardId] = React.useState('');
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  const openModal = useModalStore((state) => state.openModal);

  const mutation = useMutation({
    mutationFn: (hashId: string) => boardService.getByHashId(hashId),
    onSuccess: (board) => {
      if (board && board.id) {
        navigate(`/board/${board.id}`, {
          state: {
            id: board.id,
            name: board.name,
          },
        });
      } else {
        showToast('Something went wrong :(', 'error');
      }
    },
    onError: (error) => {
      if (
        error?.message?.includes('404') ||
        error?.message?.toLowerCase().includes('not found')
      ) {
        showToast('Board not found :(', 'error');
      } else {
        showToast('Failed to fetch data for requested board :(', 'error');
      }
    },
  });

  const handleFind = () => {
    const trimmedId = boardId.trim();
    if (!trimmedId) {
      alert('Please enter a board hash ID');
      return;
    }

    mutation.mutate(trimmedId);
  };

  return (
    <div className="bg-graphite min-h-[100vh] flex flex-col gap-[10px]">
      <Header title="Boards" />
      <div className="max-w-[1200px] mx-auto space-y-5 w-full pt-5">
        <div className="flex space-x-5 ">
          <Input
            id="board-hash-id-input"
            placeholder="Enter board hashID"
            value={boardId}
            onChange={(e) => setBoardId(e.target.value)}
          />
          <Button
            id="find-board-by-hash-id-button"
            text={mutation.isPending ? 'Loading...' : 'Find'}
            variant="white"
            onClick={handleFind}
            disabled={mutation.isPending || boardId.trim() === ''}
          />
          <Button
            id="create-board-button"
            text="Create board"
            onClick={() => {
              openModal('create_board', undefined);
            }}
          />
        </div>

        <BoardList />
      </div>
    </div>
  );
};
