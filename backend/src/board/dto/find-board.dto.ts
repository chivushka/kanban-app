import { IsOptional, IsString } from 'class-validator';

export class FindBoardDto {
  @IsOptional()
  @IsString()
  hashId?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
