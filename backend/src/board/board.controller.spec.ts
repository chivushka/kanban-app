import { Test, TestingModule } from '@nestjs/testing';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

const mockBoard = {
  id: '1',
  hashId: 'ivaBoard123456',
  name: 'Testing Board',
  createdAt: new Date(),
};

describe('BoardController', () => {
  let controller: BoardController;
  let service: BoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardController],
      providers: [
        {
          provide: BoardService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockBoard),
            findAll: jest.fn().mockResolvedValue([mockBoard]),
            findByHashId: jest.fn().mockResolvedValue(mockBoard),
            update: jest
              .fn()
              .mockResolvedValue({ ...mockBoard, name: 'Updated Board' }),
            delete: jest.fn().mockResolvedValue(mockBoard),
          },
        },
      ],
    }).compile();

    controller = module.get<BoardController>(BoardController);
    service = module.get<BoardService>(BoardService);
  });

  it('should create a board', async () => {
    const dto = { name: 'Testing Board 2' };
    const result = await controller.create(dto as any);
    expect(result).toEqual(mockBoard);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should find all boards', async () => {
    const result = await controller.findAll({});
    expect(result).toEqual([mockBoard]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should find one board by hashId', async () => {
    const result = await controller.findOne('ivaBoard123456');
    expect(result).toEqual(mockBoard);
    expect(service.findByHashId).toHaveBeenCalledWith('ivaBoard123456');
  });

  it('should update a board', async () => {
    const dto = { name: 'Updated Board' };
    const result = await controller.update('1', dto as any);
    expect(result.name).toBe('Updated Board');
    expect(service.update).toHaveBeenCalledWith('1', dto);
  });

  it('should delete a board', async () => {
    const result = await controller.delete('1');
    expect(result).toEqual(mockBoard);
    expect(service.delete).toHaveBeenCalledWith('1');
  });
});
