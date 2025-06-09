import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { MoveCardDto } from './dto/move-card.dto';

@Injectable()
export class CardService {
  constructor(private readonly prisma: PrismaService) {}

  async getCardsByBoard(boardId: string) {
    return this.prisma.card.findMany({
      where: { boardId },
      orderBy: [{ column: 'asc' }, { order: 'asc' }],
    });
  }

  async createCard(boardId: string, dto: CreateCardDto) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
    });
    if (!board) throw new NotFoundException('Board not found');

    const maxOrder = await this.prisma.card.aggregate({
      where: {
        boardId,
        column: dto.column,
      },
      _max: { order: true },
    });

    return this.prisma.card.create({
      data: {
        ...dto,
        boardId,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });
  }

  async updateCard(cardId: string, dto: UpdateCardDto) {
    return this.prisma.card.update({
      where: { id: cardId },
      data: dto,
    });
  }

  async deleteCard(cardId: string) {
    return this.prisma.card.delete({
      where: { id: cardId },
    });
  }

  async moveCard(cardId: string, dto: MoveCardDto) {
    const card = await this.prisma.card.findUnique({ where: { id: cardId } });
    if (!card) throw new NotFoundException('Card not found');

    const isSameColumn = card.column === dto.column;

    if (isSameColumn) {
      if (dto.order < card.order) {
        await this.prisma.card.updateMany({
          where: {
            boardId: card.boardId,
            column: dto.column,
            order: {
              gte: dto.order,
              lt: card.order,
            },
          },
          data: { order: { increment: 1 } },
        });
      } else if (dto.order > card.order) {
        await this.prisma.card.updateMany({
          where: {
            boardId: card.boardId,
            column: dto.column,
            order: {
              gt: card.order,
              lte: dto.order,
            },
          },
          data: { order: { decrement: 1 } },
        });
      }
    } else {
      await this.prisma.card.updateMany({
        where: {
          boardId: card.boardId,
          column: dto.column,
          order: {
            gte: dto.order,
          },
        },
        data: {
          order: { increment: 1 },
        },
      });

      await this.prisma.card.updateMany({
        where: {
          boardId: card.boardId,
          column: card.column,
          order: {
            gt: card.order,
          },
        },
        data: {
          order: { decrement: 1 },
        },
      });
    }

    return this.prisma.card.update({
      where: { id: cardId },
      data: {
        column: dto.column,
        order: dto.order,
      },
    });
  }
}
