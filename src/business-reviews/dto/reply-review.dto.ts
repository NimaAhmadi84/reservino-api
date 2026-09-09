import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReplyReviewDto {
  @ApiProperty({
    description: 'متن پاسخ',
    example: 'از نظر شما سپاسگزاریم، حتماً بهبود می‌دهیم.',
    minLength: 5,
    maxLength: 500,
  })
  @IsString({ message: 'متن پاسخ باید رشته باشد' })
  @MinLength(5, { message: 'متن پاسخ باید حداقل ۵ کاراکتر باشد' })
  @MaxLength(500, { message: 'متن پاسخ نمی‌تواند بیش از ۵۰۰ کاراکتر باشد' })
  text!: string;
}