import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockBoard = {
  id: '1',
  hashId: 'ivaBoard123456',
  name: 'Test Board',
  createdAt: new Date(),
};

describe('BoardService', () => {
  let service: BoardService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        {
          provide: PrismaService,
          useValue: {
            board: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BoardService>(BoardService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a board', async () => {
    (prisma.board.create as jest.Mock).mockResolvedValue(mockBoard);
    const dto = { name: 'Test Board' };
    const result = await service.create(dto as any);
    expect(result).toEqual(mockBoard);
    expect(prisma.board.create).toHaveBeenCalled();
  });

  it('should find all boards', async () => {
    (prisma.board.findMany as jest.Mock).mockResolvedValue([mockBoard]);
    const result = await service.findAll({});
    expect(result).toEqual([mockBoard]);
    expect(prisma.board.findMany).toHaveBeenCalled();
  });

  it('should find a board by hashId', async () => {
    (prisma.board.findUnique as jest.Mock).mockResolvedValue(mockBoard);
    const result = await service.findByHashId('ivaBoard123456');
    expect(result).toEqual(mockBoard);
    expect(prisma.board.findUnique).toHaveBeenCalledWith({ where: { hashId: 'ivaBoard123456' } });
  });

  it('should throw if board is not found by hashId', async () => {
    (prisma.board.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(service.findByHashId('notfound')).rejects.toThrow(NotFoundException);
  });

  it('should update a board', async () => {
    (prisma.board.update as jest.Mock).mockResolvedValue({ ...mockBoard, name: 'Updated Board' });
    const result = await service.update('1', { name: 'Updated Board' } as any);
    expect(result.name).toBe('Updated Board');
    expect(prisma.board.update).toHaveBeenCalled();
  });

  it('should delete a board', async () => {
    (prisma.board.findUnique as jest.Mock).mockResolvedValue(mockBoard);
    (prisma.board.delete as jest.Mock).mockResolvedValue(mockBoard);
    const result = await service.delete('1');
    expect(result).toEqual(mockBoard);
    expect(prisma.board.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should throw error if deleting a board that does not exist', async () => {
    (prisma.board.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(service.delete('notfound')).rejects.toThrow(NotFoundException);
  });
});
