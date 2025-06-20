import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;


  @IsNotEmpty()
  @IsNumber()
  star: number;

  @IsNotEmpty()
  @IsNumber()
  talentId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
} 