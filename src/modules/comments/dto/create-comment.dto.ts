import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'Bài giảng rất hay và dễ hiểu.' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ example: 5, description: 'Số sao đánh giá từ 1 đến 5' })
  @IsNotEmpty()
  @IsNumber()
  star: number;

  @ApiProperty({ example: 12, description: 'ID của người tài năng (talent)' })
  @IsNotEmpty()
  @IsNumber()
  talentId: number;

  @ApiProperty({ example: 3, description: 'ID của người dùng bình luận' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
