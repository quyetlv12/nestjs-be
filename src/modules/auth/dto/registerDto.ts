import { IsEmail, IsNotEmpty, MinLength, ValidateIf, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Email của người dùng',
    example: 'user@example.com',
    type: String,
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email là bắt buộc' })
  email: string;

  @ApiProperty({
    description: 'Tên của người dùng',
    example: 'Nguyễn Văn A',
    type: String,
  })
  @IsNotEmpty({ message: 'Tên là bắt buộc' })
  name: string;

  @ApiProperty({
    description: 'Mật khẩu của người dùng (tối thiểu 6 ký tự)',
    example: 'password123',
    type: String,
    minLength: 6,
  })
  @IsNotEmpty({ message: 'Mật khẩu là bắt buộc' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @ApiProperty({
    description: 'Xác nhận mật khẩu',
    example: 'password123',
    type: String,
  })
  @IsNotEmpty({ message: 'Xác nhận mật khẩu là bắt buộc' })
  confirmPassword: string;
}
