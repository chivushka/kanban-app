import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardService } from './card.service';

const mockCard = {
  id: 'card123456',
  title: 'Test Card',
  description: 'Test Description',
  column: 'todo',
  order: 0,
  boardId: 'board123456',
};

describe('CardController', () => {
  let controller: CardController;
  let service: CardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardController],
      providers: [
        {
          provide: CardService,
          useValue: {
            getCardsByBoard: jest.fn().mockResolvedValue([mockCard]),
            createCard: jest.fn().mockResolvedValue(mockCard),
            updateCard: jest
              .fn()
              .mockResolvedValue({ ...mockCard, title: 'Updated Card' }),
            deleteCard: jest.fn().mockResolvedValue(mockCard),
            moveCard: jest
              .fn()
              .mockResolvedValue({ ...mockCard, column: 'done', order: 1 }),
          },
        },
      ],
    }).compile();

    controller = module.get<CardController>(CardController);
    service = module.get<CardService>(CardService);
  });

  it('should get cards by board', async () => {
    const result = await controller.getCardsByBoard('board123456');
    expect(result).toEqual([mockCard]);
    expect(service.getCardsByBoard).toHaveBeenCalledWith('board123456');
  });

  it('should create a card', async () => {
    const dto = {
      title: 'Test Card',
      description: 'Test Description',
      column: 'todo',
    };
    const result = await controller.createCard('board123456', dto as any);
    expect(result).toEqual(mockCard);
    expect(service.createCard).toHaveBeenCalledWith('board123456', dto);
  });

  it('should update a card', async () => {
    const dto = { title: 'Updated Card' };
    const result = await controller.updateCard('card123456', dto as any);
    expect(result.title).toBe('Updated Card');
    expect(service.updateCard).toHaveBeenCalledWith('card123456', dto);
  });

  it('should delete a card', async () => {
    const result = await controller.deleteCard('card123456');
    expect(result).toEqual(mockCard);
    expect(service.deleteCard).toHaveBeenCalledWith('card123456');
  });

  it('should move a card', async () => {
    const dto = { column: 'done', order: 1 };
    const result = await controller.moveCard('card123456', dto as any);
    expect(result.column).toBe('done');
    expect(result.order).toBe(1);
    expect(service.moveCard).toHaveBeenCalledWith('card123456', dto);
  });
});
