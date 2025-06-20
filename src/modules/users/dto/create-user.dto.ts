import { IsNotEmpty, IsOptional, IsString, IsEmail, IsBoolean, IsDate, IsArray, IsNumber, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsNumber()
  business_id?: number;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsBoolean()
  availableFor24hDelivery?: boolean;


  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  tags?: any;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  job?: string;

  @IsNotEmpty()
  @IsString()
  nick_name: string;

  @IsOptional()
  @IsEnum(['active', 'inactive', 'pending'])
  status?: 'active' | 'inactive' | 'pending';

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  categories?: [];
}
