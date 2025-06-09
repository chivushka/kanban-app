import { IsEnum, IsInt, Min } from 'class-validator';
import { Column } from '@prisma/client';

export class MoveCardDto {
  @IsEnum(Column)
  column: Column;

  @IsInt()
  @Min(0)
  order: number;
}
