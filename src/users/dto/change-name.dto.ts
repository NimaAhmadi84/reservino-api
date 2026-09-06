import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeNameDto {
  @ApiProperty({
    example: 'علی رضایی',
    description: 'نام و نام خانوادگی جدید',
  })
  @IsString()
  @MinLength(3, { message: 'نام باید حداقل ۳ کاراکتر باشد' })
  @MaxLength(60, { message: 'نام نباید بیشتر از ۶۰ کاراکتر باشد' })
  @Matches(/^[^\d]*$/, { message: 'نام نباید شامل عدد باشد' })
  @Matches(
    /^[A-Za-z\u0621-\u064A\u0671-\u06CC][A-Za-z\u0621-\u064A\u0671-\u06CC\s\u200C'-]*$/,
    { message: 'نام فقط می‌تواند شامل حروف فارسی/انگلیسی، فاصله و نیم‌فاصله باشد' },
  )
  name!: string;
}