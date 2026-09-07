import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// نام باید یک‌دست باشد: کاملاً فارسی یا کاملاً انگلیسی (ترکیبی ممنوع)
const NAME_SCRIPT_REGEX = /^([\u0621-\u064A\u0671-\u06CC\s\u200C]+|[A-Za-z\s'-]+)$/;

export class ChangeNameDto {
  @ApiProperty({
    example: 'علی رضایی',
    description: 'نام و نام خانوادگی جدید (کاملاً فارسی یا کاملاً انگلیسی)',
  })
  @IsString()
  @MinLength(3, { message: 'نام باید حداقل ۳ کاراکتر باشد' })
  @MaxLength(60, { message: 'نام نباید بیشتر از ۶۰ کاراکتر باشد' })
  @Matches(/^[^\d]*$/, { message: 'نام نباید شامل عدد باشد' })
  @Matches(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]*$/, {
    message: 'نام نباید شامل علامت‌های خاص (@، #، !، * و...) باشد',
  })
  @Matches(NAME_SCRIPT_REGEX, {
    message: 'نام باید کاملاً فارسی یا کاملاً انگلیسی باشد (ترکیبی ممنوع)',
  })
  name!: string;
}