import { IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * DTO آمار درآمد OWNER
 *
 * - `from` و `to` اختیاری — پیش‌فرض ۳۰ روز گذشته
 * - فرمت ISO 8601 (YYYY-MM-DD یا full datetime)
 * - حداکثر بازه: ۳۶۵ روز (یک سال)
 */
export class IncomeStatsQueryDto {
  @ApiProperty({
    required: false,
    description: 'تاریخ شروع بازه (ISO 8601)',
    example: '2026-08-01',
  })
  @IsOptional()
  @IsDateString(
    { strict: false },
    { message: 'تاریخ شروع باید به فرمت ISO 8601 باشد' },
  )
  @Type(() => String)
  from?: string;

  @ApiProperty({
    required: false,
    description: 'تاریخ پایان بازه (ISO 8601)',
    example: '2026-08-31',
  })
  @IsOptional()
  @IsDateString(
    { strict: false },
    { message: 'تاریخ پایان باید به فرمت ISO 8601 باشد' },
  )
  @Type(() => String)
  to?: string;
}