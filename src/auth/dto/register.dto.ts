import { IsEmail, IsEnum, IsString, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

// Regex نام: فقط حروف فارسی/انگلیسی، فاصله، نیم‌فاصله، خط تیره و آپوستروف
const NAME_REGEX = /^[A-Za-z\u0621-\u064A\u0671-\u06CC][A-Za-z\u0621-\u064A\u0671-\u06CC\s\u200C'-]*$/;

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'ایمیل معتبر' })
  @IsEmail({}, { message: 'ایمیل وارد شده نامعتبر است' })
  email!: string;

  @ApiProperty({ example: 'علی احمدی', description: 'نام کاربر (حروف فارسی/انگلیسی فقط)' })
  @IsString({ message: 'نام باید رشته باشد' })
  @MinLength(3, { message: 'نام باید حداقل ۳ کاراکتر باشد' })
  @MaxLength(60, { message: 'نام نباید بیش از ۶۰ کاراکتر باشد' })
  @Matches(/^[^\d]*$/, { message: 'نام نباید شامل عدد باشد' })
  @Matches(NAME_REGEX, {
    message: 'نام فقط می‌تواند شامل حروف فارسی/انگلیسی، فاصله و نیم‌فاصله باشد',
  })
  name!: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'رمز عبور قوی (حداقل ۸ کاراکتر، شامل حرف بزرگ، کوچک، عدد و نماد)',
    minLength: 8,
  })
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

  @ApiProperty({ enum: UserRole, default: UserRole.CUSTOMER, required: false })
  @IsOptional()
  @IsEnum(UserRole, { message: 'نقش انتخابی نامعتبر است' })
  role?: UserRole;
}