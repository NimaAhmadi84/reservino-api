import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BusinessLikesService } from './business-likes.service';
import { BusinessLikesController } from './business-likes.controller';

@Module({
  imports: [PrismaModule],
  controllers: [BusinessLikesController],
  providers: [BusinessLikesService],
  exports: [BusinessLikesService],
})
export class BusinessLikesModule {}