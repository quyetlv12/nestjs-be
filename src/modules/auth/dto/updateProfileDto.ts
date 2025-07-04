import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsPhoneNumber } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Tên là bắt buộc' })
  name?: string;

  @IsOptional()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password?: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Số điện thoại là bắt buộc' })
  @IsPhoneNumber("VN", { message: 'Số điện thoại không hợp lệ' })
  phone?: string;

  
}
