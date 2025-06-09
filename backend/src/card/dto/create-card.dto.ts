import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Column } from '@prisma/client';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Column)
  column: Column;
}
