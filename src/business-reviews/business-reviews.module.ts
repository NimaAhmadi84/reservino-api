import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BusinessReviewsService } from './business-reviews.service';
import { BusinessReviewsController } from './business-reviews.controller';

@Module({
  imports: [PrismaModule],
  controllers: [BusinessReviewsController],
  providers: [BusinessReviewsService],
  exports: [BusinessReviewsService],
})
export class BusinessReviewsModule {}