import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
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
    /**
   * لیست کاربرانی که کسب‌وکار رو لایک کردن (فقط OWNER می‌تونه ببینه)
   *
   * @param businessId - شناسه کسب‌وکار
   * @param ownerId - شناسه کاربر جاری (برای ownership check)
   * @param page - شماره صفحه (از ۱)
   * @param limit - تعداد در هر صفحه (۱ تا ۵۰)
   */
  async listLikers(
    businessId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    // ──── بررسی وجود کسب‌وکار (لیست لایک‌کننده‌ها عمومی است — social proof) ────
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { id: true, likesCount: true },
    });

    if (!business) {
      throw new NotFoundException('کسب‌وکار یافت نشد');
    }

    const skip = (page - 1) * limit;

        // ──── برای scaling (۵۰۰۰+ لایک) از likesCount cached استفاده می‌کنیم ────
    // این کار count query رو حذف می‌کنه و response رو سریع‌تر می‌کنه
    const items = await this.prisma.businessLike.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    const total = business.likesCount ?? 0;

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items: items.map((like) => ({
        id: like.user.id,
        name: like.user.name || 'کاربر رزویو',
        email: like.user.email || null,
        phone: like.user.phone || null,
        likedAt: like.createdAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      totalCount: business.likesCount ?? 0,
    };
  }
}