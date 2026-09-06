import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { OtpService } from '../otp/otp.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => OtpService))
    private readonly otpService: OtpService,
  ) {}

  async create(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('این ایمیل قبلاً ثبت شده است');
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: dto.password,
        role: dto.role,
      },
    });

    const { password, ...result } = user;
    return result;
  }

  async createWithHashedPassword(dto: {
    email: string;
    name: string;
    password: string;
    role: any;
  }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('این ایمیل قبلاً ثبت شده است');
    }

    const user = await this.prisma.user.create({
      data: dto,
    });

    const { password, ...result } = user;
    return result;
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        phone: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        nationalId: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'کاربر با موفقیت حذف شد' };
  }

  async findByEmailOrPhone(identifier: string) {
    const isEmail = identifier.includes('@');
    if (isEmail) {
      return this.prisma.user.findUnique({ where: { email: identifier } });
    }
    return this.prisma.user.findUnique({ where: { phone: identifier } });
  }

  async createMinimal(data: {
    email?: string;
    phone?: string;
    password?: string;
    name?: string;
    role?: any;
  }) {
    return this.prisma.user.create({ data: data as any });
  }

  async updateUser(id: string, data: any) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    if (user.nationalId && dto.nationalId && user.nationalId !== dto.nationalId) {
      throw new BadRequestException(
        'کد ملی شما قبلاً در پروفایل ثبت شده است و قابل تغییر نیست.',
      );
    }

    if (dto.nationalId && !this.validateIranianNationalId(dto.nationalId)) {
      throw new BadRequestException('کد ملی نامعتبر است');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { nationalId: dto.nationalId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        nationalId: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.logger.log(`🆔 nationalId set for user ${userId} via profile update`);
    return updated;
  }

  async changeName(userId: string, name: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { name },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        nationalId: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.logger.log(`✏️ Name changed for user ${userId}`);
    return updated;
  }

  async requestEmailChange(userId: string, newEmail: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    if (user.email === newEmail) {
      throw new BadRequestException('ایمیل جدید نباید با ایمیل فعلی یکسان باشد');
    }

    const existingUser = await this.prisma.user.findUnique({ where: { email: newEmail } });
    if (existingUser) {
      throw new ConflictException('این ایمیل قبلاً توسط کاربر دیگری استفاده شده است');
    }

    await this.otpService.request(newEmail);

    this.logger.log(`📧 Email change requested for user ${userId} to ${newEmail}`);
    return { success: true, message: 'کد تایید به ایمیل جدید ارسال شد' };
  }

  async confirmEmailChange(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    const recentOtps = await this.prisma.otpCode.findMany({
      where: {
        verified: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const validOtp = recentOtps.find((otp) => otp.code === code);
    if (!validOtp) {
      throw new BadRequestException('کد تایید نامعتبر یا منقضی شده است');
    }

    const newEmail = validOtp.identifier;

    if (user.email === newEmail) {
      throw new BadRequestException('ایمیل جدید نباید با ایمیل فعلی یکسان باشد');
    }

    const existingUser = await this.prisma.user.findUnique({ where: { email: newEmail } });
    if (existingUser) {
      throw new ConflictException('این ایمیل قبلاً توسط کاربر دیگری استفاده شده است');
    }

    await this.prisma.otpCode.update({
      where: { id: validOtp.id },
      data: { verified: true },
    });

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { email: newEmail },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        nationalId: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.logger.log(`✅ Email changed for user ${userId} to ${newEmail}`);
    return updated;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    if (!user.password) {
      throw new BadRequestException(
        'شما با OTP وارد شده‌اید و رمز عبور ندارید. لطفاً ابتدا رمز عبور تنظیم کنید.',
      );
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('رمز عبور فعلی صحیح نیست');
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('رمز عبور جدید و تکرار آن مطابقت ندارند');
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('رمز جدید نباید با رمز فعلی یکسان باشد');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    this.logger.log(`🔐 Password changed for user ${userId}`);
    return { success: true, message: 'رمز عبور با موفقیت تغییر کرد' };
  }

  private validateIranianNationalId(nationalId: string): boolean {
    if (!/^\d{10}$/.test(nationalId)) return false;
    if (/^(\d)\1{9}$/.test(nationalId)) return false;

    const digits = nationalId.split('').map(Number);
    const check = digits[9];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (10 - i);
    }

    const remainder = sum % 11;
    return remainder < 2 ? check === remainder : check === 11 - remainder;
  }
}