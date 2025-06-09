import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { Board, BoardGetAllResponse } from '@/types/board.types';
import { boardService } from '@/shared/services/board.service';
import { QUERY_KEYS } from '@/shared/keys';

export function useBoards(): UseQueryResult<Board[], Error> {
  return useQuery<Board[], Error>({
    queryKey: [QUERY_KEYS.BOARD],
    queryFn: async () => {
      const response: BoardGetAllResponse = await boardService.getAll();
      console.log(response);
      return response;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
