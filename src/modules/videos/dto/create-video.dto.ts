import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVideoDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  videoLink: string;

  @IsNotEmpty()
  @IsString()
  thumbnailLink: string;

  @IsNotEmpty()
  @IsString()
  duration: string;

  @IsNotEmpty()
  createdById: number; // user ID
}
