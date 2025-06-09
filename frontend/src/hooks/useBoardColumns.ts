import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { cardService } from '@/shared/services/card.service';
import type { CardData } from '@/types/card.types';
import type { BoardColumns } from '@/types/column.types';
import { QUERY_KEYS } from '@/shared/keys';
import { useBoardStore } from '@/store/board.store';

export function useBoardColumns(): UseQueryResult<BoardColumns, Error> {
  const boardId = useBoardStore((state) => state.boardId);

  return useQuery<BoardColumns, Error>({
    queryKey: [QUERY_KEYS.CARD, boardId],
    queryFn: async () => {
      if (!boardId) return { todo: [], in_progress: [], done: [] };
      const cards: CardData[] = await cardService.getAll(boardId);
      const columns: BoardColumns = {
        todo: [],
        in_progress: [],
        done: [],
      };
      for (const card of cards) {
        if (card.column && columns[card.column]) {
          columns[card.column].push(card);
        }
      }
      return columns;
    },
    enabled: !!boardId,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}
