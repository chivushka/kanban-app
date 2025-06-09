import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { nanoid } from 'nanoid';
import { PrismaService } from '../prisma/prisma.service';
import { FindBoardDto } from './dto/find-board.dto';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBoardDto) {
    const hashId = nanoid(10);
    return this.prisma.board.create({
      data: { ...dto, hashId },
    });
  }

  async findAll(dto: FindBoardDto) {
    return this.prisma.board.findMany({
      where: {
        ...(dto.hashId && { hashId: dto.hashId }),
        ...(dto.name && { name: { contains: dto.name, mode: 'insensitive' } }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByHashId(hashId: string) {
    const board = await this.prisma.board.findUnique({
      where: { hashId },
    });

    if (!board) throw new NotFoundException('Board not found');

    return board;
  }

  async update(id: string, dto: UpdateBoardDto) {
    return this.prisma.board.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    const existing = await this.prisma.board.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Board not found');
    }

    return this.prisma.board.delete({ where: { id } });
  }
}
