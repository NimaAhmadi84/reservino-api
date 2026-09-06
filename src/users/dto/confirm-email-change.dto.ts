import { IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmEmailChangeDto {
  @ApiProperty({
    example: '123456',
    description: 'کد تایید ۶ رقمی ارسال شده به ایمیل جدید',
  })
  @IsString()
  @Length(6, 6, { message: 'کد تایید باید دقیقاً ۶ رقم باشد' })
  @Matches(/^\d{6}$/, { message: 'کد تایید باید فقط شامل ارقام باشد' })
  code!: string;
}