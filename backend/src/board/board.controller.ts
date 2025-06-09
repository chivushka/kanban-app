import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardService } from './board.service';
import { FindBoardDto } from './dto/find-board.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  findAll(@Query() dto: FindBoardDto) {
    return this.boardService.findAll(dto);
  }

  @Post()
  create(@Body() dto: CreateBoardDto) {
    return this.boardService.create(dto);
  }

  @Get(':hashId')
  findOne(@Param('hashId') hashId: string) {
    return this.boardService.findByHashId(hashId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBoardDto) {
    return this.boardService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.boardService.delete(id);
  }
}
