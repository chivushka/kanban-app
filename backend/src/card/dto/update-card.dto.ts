import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Column } from '@prisma/client';

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(Column)
  column?: Column;
}

