import { IsOptional, IsPositive } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class PageRequestDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Transform(({ value }) => value ?? 1) 
  readonly page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Transform(({ value }) => value ?? 10)
  readonly limit: number = 10;

  constructor(page?: number, limit?: number) {
    this.page = page || 1;
    this.limit = limit || 10;
  }
}