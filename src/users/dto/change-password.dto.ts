import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'رمز عبور فعلی',
  })
  @IsString()
  @MinLength(1, { message: 'رمز عبور فعلی الزامی است' })
  currentPassword!: string;

  @ApiProperty({
    description: 'رمز عبور جدید (حداقل ۸ کاراکتر، شامل حرف بزرگ، کوچک، عدد و نماد)',
  })
  @IsString()
  @MinLength(8, { message: 'رمز عبور باید حداقل ۸ کاراکتر باشد' })
  @MaxLength(64, { message: 'رمز عبور نباید بیشتر از ۶۴ کاراکتر باشد' })
  @Matches(/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/, {
    message: 'رمز عبور باید فقط شامل حروف انگلیسی، اعداد و نمادها باشد',
  })
  @Matches(/[A-Z]/, { message: 'رمز عبور باید حداقل یک حرف بزرگ انگلیسی (A-Z) داشته باشد' })
  @Matches(/[a-z]/, { message: 'رمز عبور باید حداقل یک حرف کوچک انگلیسی (a-z) داشته باشد' })
  @Matches(/[0-9]/, { message: 'رمز عبور باید حداقل یک عدد (0-9) داشته باشد' })
  @Matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
    message: 'رمز عبور باید حداقل یک نماد خاص (!@#$%...) داشته باشد',
  })
  newPassword!: string;

  @ApiProperty({
    description: 'تکرار رمز عبور جدید',
  })
  @IsString()
  @MinLength(1, { message: 'تکرار رمز عبور الزامی است' })
  confirmPassword!: string;
}