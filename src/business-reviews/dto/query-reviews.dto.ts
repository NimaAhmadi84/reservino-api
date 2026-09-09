import { IsOptional, IsInt, IsString, IsIn, Min, Max, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryReviewsDto {
  @ApiPropertyOptional({ description: 'فیلتر بر اساس ستاره (۱ تا ۵)', minimum: 1, maximum: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'فیلتر ستاره باید عدد صحیح باشد' })
  @Min(1, { message: 'حداقل ستاره ۱ است' })
  @Max(5, { message: 'حداکثر ستاره ۵ است' })
  rating?: number;

  @ApiPropertyOptional({ description: 'مرتب‌سازی', enum: ['newest', 'helpful', 'highest', 'lowest'], default: 'newest' })
  @IsOptional()
  @IsIn(['newest', 'helpful', 'highest', 'lowest'], {
    message: 'مرتب‌سازی باید یکی از: newest, helpful, highest, lowest باشد',
  })
  sort?: 'newest' | 'helpful' | 'highest' | 'lowest';

  @ApiPropertyOptional({ description: 'جست‌وجو در متن یا نام نویسنده' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ description: 'شماره صفحه', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'تعداد در صفحه (حداکثر ۵۰)', default: 10, minimum: 1, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}