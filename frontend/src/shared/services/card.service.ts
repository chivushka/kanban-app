import type {
  CardCreateDto,
  CardData,
  CardGetAllResponse,
  CardMoveDto,
  CardUpdateDto,
} from '@/types/card.types';
import { HttpFactoryService } from './http-factory.service';
import { HttpService } from './http.service';

export class CardService {
  constructor(private httpService: HttpService) {}
  private route = 'board';

  async getAll(boardId: string) {
    return await this.httpService.get<CardGetAllResponse>(
      `${this.route}/${boardId}/card`,
    );
  }

  async create(boardId: string, dto: CardCreateDto) {
    return await this.httpService.post<CardData, CardCreateDto>(
      `${this.route}/${boardId}/card`,
      dto,
    );
  }

  async update(boardId: string, cardId: string, dto: CardUpdateDto) {
    return await this.httpService.patch<CardData, CardUpdateDto>(
      `${this.route}/${boardId}/card/${cardId}`,
      dto,
    );
  }

  async delete(boardId: string, cardId: string) {
    return await this.httpService.delete<void>(
      `${this.route}/${boardId}/card/${cardId}`,
    );
  }

  async move(boardId: string, cardId: string, dto: CardMoveDto) {
    return await this.httpService.patch<CardData, CardMoveDto>(
      `${this.route}/${boardId}/card/${cardId}/move`,
      dto,
    );
  }
}

const factory = new HttpFactoryService();
export const cardService = new CardService(factory.createHttpService());
