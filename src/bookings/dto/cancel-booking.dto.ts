import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO لغو رزرو با علت — برای مشتریان
 *
 * - حداقل ۱۰ کاراکتر (جلوگیری از «لغو»، «نمی‌خوام» و مشابه)
 * - حداکثر ۵۰۰ کاراکتر (جلوگیری از اسپم)
 * - Sanitize سمت سرور در service انجام می‌شود (defense in depth)
 */
export class CancelBookingDto {
  @ApiProperty({
    description: 'علت لغو رزرو (حداقل ۱۰ و حداکثر ۵۰۰ کاراکتر)',
    example: 'برنامه‌ام تغییر کرد و نمی‌تونم سر وقت برسم',
    minLength: 10,
    maxLength: 500,
  })
  @IsString({ message: 'علت لغو باید متن باشد' })
  @MinLength(10, {
    message: 'علت لغو باید حداقل ۱۰ کاراکتر باشد',
  })
  @MaxLength(500, {
    message: 'علت لغو نمی‌تواند بیش از ۵۰۰ کاراکتر باشد',
  })
  reason!: string;
}