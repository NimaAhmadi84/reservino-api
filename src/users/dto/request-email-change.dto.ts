import { IsString, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// ایمیل سخت‌گیرانه (RFC 5322 dot-atom + دامنه معتبر) — لایه دوم دفاع
const STRICT_EMAIL_REGEX =
  /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;

export class RequestEmailChangeDto {
  @ApiProperty({
    example: 'newemail@example.com',
    description: 'ایمیل جدید (OTP به این ایمیل ارسال می‌شود)',
  })
  @IsString()
  @MaxLength(254, { message: 'ایمیل بیش از حد طولانی است (حداکثر ۲۵۴ کاراکتر)' })
  @Matches(/^[^\s]*$/, { message: 'ایمیل نباید شامل فاصله باشد' })
  @Matches(STRICT_EMAIL_REGEX, {
    message: 'فرمت ایمیل معتبر نیست (مثال: you@gmail.com)',
  })
  newEmail!: string;
}