import { IsEmail, IsEnum, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

// نام باید یک‌دست باشد: کاملاً فارسی یا کاملاً انگلیسی (ترکیبی ممنوع)
const NAME_SCRIPT_REGEX = /^([\u0621-\u064A\u0671-\u06CC\s\u200C]+|[A-Za-z\s'-]+)$/;

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'ایمیل نامعتبر است' })
  email!: string;

  @ApiProperty({ example: 'علی احمدی' })
  @IsString()
  @MinLength(3, { message: 'نام باید حداقل ۳ کاراکتر باشد' })
  @MaxLength(60, { message: 'نام نباید بیش از ۶۰ کاراکتر باشد' })
  @Matches(/^[^\d]*$/, { message: 'نام نباید شامل عدد باشد' })
  @Matches(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]*$/, {
    message: 'نام نباید شامل علامت‌های خاص (@، #، !، * و...) باشد',
  })
  @Matches(NAME_SCRIPT_REGEX, {
    message: 'نام باید کاملاً فارسی یا کاملاً انگلیسی باشد (ترکیبی ممنوع)',
  })
  name!: string;

  @ApiProperty({ example: 'StrongPass123!', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'رمز عبور باید حداقل ۸ کاراکتر باشد' })
  @MaxLength(64, { message: 'رمز عبور نباید بیش از ۶۴ کاراکتر باشد' })
  @Matches(/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/, {
    message: 'رمز عبور باید فقط شامل حروف انگلیسی، اعداد و نمادها باشد',
  })
  @Matches(/[A-Z]/, { message: 'رمز عبور باید حداقل یک حرف بزرگ انگلیسی (A-Z) داشته باشد' })
  @Matches(/[a-z]/, { message: 'رمز عبور باید حداقل یک حرف کوچک انگلیسی (a-z) داشته باشد' })
  @Matches(/[0-9]/, { message: 'رمز عبور باید حداقل یک عدد (0-9) داشته باشد' })
  @Matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
    message: 'رمز عبور باید حداقل یک نماد خاص (!@#$%...) داشته باشد',
  })
  password!: string;

  @ApiProperty({ enum: UserRole, default: UserRole.CUSTOMER })
  @IsEnum(UserRole, { message: 'نقش انتخابی نامعتبر است' })
  role!: UserRole;
}