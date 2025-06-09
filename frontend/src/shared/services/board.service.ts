import type {
  Board,
  BoardCreateDto,
  BoardGetAllResponse,
  BoardUpdateDto,
} from '@/types/board.types';
import { HttpFactoryService } from './http-factory.service';
import { HttpService } from './http.service';

export class BoardService {
  constructor(private httpService: HttpService) {}
  private route = 'board';

  async getAll() {
    return await this.httpService.get<BoardGetAllResponse>(`${this.route}`);
  }

  async getByHashId(hashId: string) {
    return await this.httpService.get<Board>(`${this.route}/${hashId}`);
  }

  async create(dto: BoardCreateDto) {
    return await this.httpService.post<Board, BoardCreateDto>(
      `${this.route}`,
      dto,
    );
  }

  async update(id: string, dto: BoardUpdateDto) {
    return await this.httpService.put<Board, BoardUpdateDto>(
      `${this.route}/${id}`,
      dto,
    );
  }

  async delete(id: string) {
    return await this.httpService.delete<void>(`${this.route}/${id}`);
  }
}

const factory = new HttpFactoryService();
export const boardService = new BoardService(factory.createHttpService());
