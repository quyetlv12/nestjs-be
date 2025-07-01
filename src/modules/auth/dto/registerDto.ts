import { IsEmail, IsNotEmpty, MinLength, ValidateIf, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email là bắt buộc' })
  email: string;

  @IsNotEmpty({ message: 'Tên là bắt buộc' })
  name: string;

  @IsNotEmpty({ message: 'Mật khẩu là bắt buộc' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @IsNotEmpty({ message: 'Xác nhận mật khẩu là bắt buộc' })
  confirmPassword: string;
}
