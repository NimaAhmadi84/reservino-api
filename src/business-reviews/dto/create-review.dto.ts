import { IsInt, IsString, Min, Max, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'امتیاز از ۱ تا ۵', example: 5, minimum: 1, maximum: 5 })
  @IsInt({ message: 'امتیاز باید عدد صحیح باشد' })
  @Min(1, { message: 'حداقل امتیاز ۱ است' })
  @Max(5, { message: 'حداکثر امتیاز ۵ است' })
  rating!: number;

  @ApiProperty({
    description: 'متن نظر',
    example: 'کیفیت خدمات عالی بود و برخورد پرسنل بسیار خوب.',
    minLength: 5,
    maxLength: 500,
  })
  @IsString({ message: 'متن نظر باید رشته باشد' })
  @MinLength(5, { message: 'متن نظر باید حداقل ۵ کاراکتر باشد' })
  @MaxLength(500, { message: 'متن نظر نمی‌تواند بیش از ۵۰۰ کاراکتر باشد' })
  text!: string;
}