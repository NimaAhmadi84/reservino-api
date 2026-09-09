import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VoteReviewDto {
  @ApiProperty({ description: 'نوع رأی', enum: ['LIKE', 'DISLIKE'] })
  @IsIn(['LIKE', 'DISLIKE'], { message: 'رأی باید LIKE یا DISLIKE باشد' })
  kind!: 'LIKE' | 'DISLIKE';
}