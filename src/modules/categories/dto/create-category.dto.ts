import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  thumbnail: string;

  @IsOptional()
  @IsInt()
  parentId?: number;
}
