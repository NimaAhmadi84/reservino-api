import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * گارد JWT اختیاری: اگر توکن معتبر بود req.user را پر می‌کند،
 * در غیر این صورت req.user = undefined (بدون پرتاب خطا).
 * مناسب برای endpoint های عمومی که رفتار متفاوت برای کاربر لاگین‌شده دارند.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: TUser): TUser | undefined {
    // خطا یا نبود کاربر را نادیده می‌گیریم
    if (err || !user) return undefined;
    return user;
  }
}