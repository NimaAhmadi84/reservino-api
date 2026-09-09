import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BusinessLikesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * بررسی وجود کسب‌وکار (helper)
   */
  private async ensureBusinessExists(businessId: string): Promise<void> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { id: true },
    });
    if (!business) {
      throw new NotFoundException('کسب‌وکار یافت نشد');
    }
  }

  /**
   * Toggle لایک: اگر لایک کرده باشد حذف می‌شود، در غیر این صورت اضافه می‌شود
   * با transaction برای atomic بودن likesCount
   */
  async toggle(businessId: string, userId: string) {
    await this.ensureBusinessExists(businessId);

    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.businessLike.findUnique({
        where: { userId_businessId: { userId, businessId } },
      });

      let isLiked: boolean;

      if (existing) {
        // حذف لایک
        await tx.businessLike.delete({
          where: { id: existing.id },
        });
        await tx.business.update({
          where: { id: businessId },
          data: { likesCount: { decrement: 1 } },
        });
        isLiked = false;
      } else {
        // اضافه کردن لایک
        await tx.businessLike.create({
          data: { userId, businessId },
        });
        await tx.business.update({
          where: { id: businessId },
          data: { likesCount: { increment: 1 } },
        });
        isLiked = true;
      }

      // شمارش جدید
      const updated = await tx.business.findUnique({
        where: { id: businessId },
        select: { likesCount: true },
      });

      return {
        isLiked,
        count: updated?.likesCount ?? 0,
      };
    });
  }

  /**
   * وضعیت لایک + شمارش
   * userId اختیاری است (مهمان‌ها هم می‌توانند شمارش را ببینند)
   */
  async getStatus(businessId: string, userId?: string) {
    await this.ensureBusinessExists(businessId);

    const [count, myLike] = await Promise.all([
      this.prisma.business.findUnique({
        where: { id: businessId },
        select: { likesCount: true },
      }),
      userId
        ? this.prisma.businessLike.findUnique({
            where: { userId_businessId: { userId, businessId } },
          })
        : Promise.resolve(null),
    ]);

    return {
      count: count?.likesCount ?? 0,
      isLiked: Boolean(myLike),
    };
  }
}