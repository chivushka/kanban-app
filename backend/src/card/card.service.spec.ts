import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockCard = {
  id: 'card123456',
  title: 'Test Card',
  description: 'Test Description',
  column: 'todo',
  order: 0,
  boardId: 'board123456',
};

const mockBoard = {
  id: 'board123456',
  name: 'Test Board',
};

describe('CardService', () => {
  let service: CardService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardService,
        {
          provide: PrismaService,
          useValue: {
            card: {
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              aggregate: jest.fn(),
              findUnique: jest.fn(),
              updateMany: jest.fn(),
            },
            board: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CardService>(CardService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should get cards by board', async () => {
    (prisma.card.findMany as jest.Mock).mockResolvedValue([mockCard]);
    const result = await service.getCardsByBoard('board123456');
    expect(result).toEqual([mockCard]);
    expect(prisma.card.findMany).toHaveBeenCalledWith({
      where: { boardId: 'board123456' },
      orderBy: [{ column: 'asc' }, { order: 'asc' }],
    });
  });

  it('should create a card', async () => {
    (prisma.board.findUnique as jest.Mock).mockResolvedValue(mockBoard);
    (prisma.card.aggregate as jest.Mock).mockResolvedValue({ _max: { order: 1 } });
    (prisma.card.create as jest.Mock).mockResolvedValue(mockCard);

    const dto = { title: 'Test Card', description: 'Test Description', column: 'todo' };
    const result = await service.createCard('board123456', dto as any);
    expect(result).toEqual(mockCard);
    expect(prisma.card.create).toHaveBeenCalledWith({
      data: { ...dto, boardId: 'board123456', order: 2 },
    });
  });

  it('should throw if board not found when creating card', async () => {
    (prisma.board.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(
      service.createCard('board123456', { title: 'x', description: 'y', column: 'todo' } as any)
    ).rejects.toThrow(NotFoundException);
  });

  it('should update a card', async () => {
    (prisma.card.update as jest.Mock).mockResolvedValue({ ...mockCard, title: 'Updated Card' });
    const result = await service.updateCard('card123456', { title: 'Updated Card' } as any);
    expect(result.title).toBe('Updated Card');
    expect(prisma.card.update).toHaveBeenCalledWith({
      where: { id: 'card123456' },
      data: { title: 'Updated Card' },
    });
  });

  it('should delete a card', async () => {
    (prisma.card.delete as jest.Mock).mockResolvedValue(mockCard);
    const result = await service.deleteCard('card123456');
    expect(result).toEqual(mockCard);
    expect(prisma.card.delete).toHaveBeenCalledWith({ where: { id: 'card123456' } });
  });

  describe('moveCard', () => {
    it('should throw if card not found', async () => {
      (prisma.card.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(
        service.moveCard('card123456', { column: 'done', order: 0 } as any)
      ).rejects.toThrow(NotFoundException);
    });

    it('should move card within the same column (up)', async () => {
      (prisma.card.findUnique as jest.Mock).mockResolvedValue({ ...mockCard, order: 2, column: 'todo' });
      (prisma.card.updateMany as jest.Mock).mockResolvedValue({});
      (prisma.card.update as jest.Mock).mockResolvedValue({ ...mockCard, order: 1 });

      const result = await service.moveCard('card123456', { column: 'todo', order: 1 } as any);
      expect(prisma.card.updateMany).toHaveBeenCalled();
      expect(prisma.card.update).toHaveBeenCalled();
      expect(result.order).toBe(1);
    });

    it('should move card to a different column', async () => {
      (prisma.card.findUnique as jest.Mock).mockResolvedValue({ ...mockCard, order: 0, column: 'todo' });
      (prisma.card.updateMany as jest.Mock).mockResolvedValue({});
      (prisma.card.update as jest.Mock).mockResolvedValue({ ...mockCard, column: 'done', order: 0 });

      const result = await service.moveCard('card123456', { column: 'done', order: 0 } as any);
      expect(prisma.card.updateMany).toHaveBeenCalledTimes(2);
      expect(prisma.card.update).toHaveBeenCalled();
      expect(result.column).toBe('done');
    });
  });
});
