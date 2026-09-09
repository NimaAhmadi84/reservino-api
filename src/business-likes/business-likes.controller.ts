import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { BusinessLikesService } from './business-likes.service';

@ApiTags('Business Likes')
@Controller('businesses')
export class BusinessLikesController {
  constructor(private readonly likesService: BusinessLikesService) {}

  /**
   * Toggle لایک صفحه (نیاز به احراز هویت)
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/like')
  @ApiOperation({ summary: 'Toggle لایک کسب‌وکار (افزودن/حذف)' })
  @ApiParam({ name: 'id', type: 'string', description: 'شناسه کسب‌وکار (UUID)' })
  async toggle(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() req: any,
  ) {
    // پشتیبانی از هر دو ساختار JWT (sub یا id)
    const userId = req.user?.sub ?? req.user?.id;
    return this.likesService.toggle(id, userId);
  }

  /**
   * وضعیت لایک (optional auth — مهمان‌ها هم می‌توانند شمارش را ببینند)
   */
  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id/likes')
  @ApiOperation({ summary: 'وضعیت لایک و شمارش (عمومی با auth اختیاری)' })
  @ApiParam({ name: 'id', type: 'string', description: 'شناسه کسب‌وکار (UUID)' })
  async getStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() req: any,
  ) {
    const userId = req.user?.sub ?? req.user?.id;
    return this.likesService.getStatus(id, userId);
  }
}