import { IsEmail, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestEmailChangeDto {
  @ApiProperty({
    example: 'newemail@example.com',
    description: 'ایمیل جدید (OTP به این ایمیل ارسال می‌شود)',
  })
  @IsEmail({}, { message: 'فرمت ایمیل صحیح نیست' })
  @MaxLength(254, { message: 'ایمیل بیش از حد طولانی است' })
  newEmail!: string;
}