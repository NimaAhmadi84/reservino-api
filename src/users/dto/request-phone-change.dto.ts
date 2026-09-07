import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestPhoneChangeDto {
  @ApiProperty({
    example: '09123456789',
    description: 'شماره جدید (OTP به این شماره ارسال می‌شود)',
  })
  @IsString()
  @Matches(/^09\d{9}$/, { message: 'شماره موبایل باید دقیقاً ۱۱ رقم و با 09 شروع شود' })
  newPhone!: string;
}