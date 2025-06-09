import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseUUIDPipe,
  Get,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { MoveCardDto } from './dto/move-card.dto';

@Controller('board/:boardId/card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get()
  getCardsByBoard(@Param('boardId', ParseUUIDPipe) boardId: string) {
    return this.cardService.getCardsByBoard(boardId);
  }

  @Post()
  createCard(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Body() dto: CreateCardDto,
  ) {
    return this.cardService.createCard(boardId, dto);
  }

  @Patch(':cardId')
  updateCard(
    @Param('cardId', ParseUUIDPipe) cardId: string,
    @Body() dto: UpdateCardDto,
  ) {
    return this.cardService.updateCard(cardId, dto);
  }

  @Delete(':cardId')
  deleteCard(@Param('cardId', ParseUUIDPipe) cardId: string) {
    return this.cardService.deleteCard(cardId);
  }

  @Patch(':cardId/move')
  moveCard(
    @Param('cardId', ParseUUIDPipe) cardId: string,
    @Body() dto: MoveCardDto,
  ) {
    return this.cardService.moveCard(cardId, dto);
  }
}
