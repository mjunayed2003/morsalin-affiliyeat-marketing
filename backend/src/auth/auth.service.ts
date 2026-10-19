import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { MailService } from '../mail/mail.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import {
  SendRegisterOtpDto,
  VerifyRegisterOtpDto,
  SendForgotPasswordOtpDto,
  ResetPasswordDto,
} from './dto/otp-auth.dto.js';
import { validateAndFormatUsaPhone, formatUsaPhoneDisplay } from './utils/phone.util.js';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  private normalizePhone(phone: string): string {
    return phone.replace(/[\s\-()]/g, '').trim();
  }

  /**
   * STEP 1: Send 6-digit OTP to user's Gmail for Registration
   */
  async sendRegisterOtp(dto: SendRegisterOtpDto) {
    if (!dto.name || !dto.name.trim()) {
      throw new BadRequestException('Please enter your full name.');
    }

    if (!dto.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email.trim())) {
      throw new BadRequestException('Please provide a valid Gmail / email address.');
    }
    const cleanEmail = dto.email.trim().toLowerCase();

    // Enforce USA phone number validation
    const phoneCheck = validateAndFormatUsaPhone(dto.phone);
    if (!phoneCheck.isValid) {
      throw new BadRequestException(
        phoneCheck.error || 'Only USA phone numbers are allowed (+1 followed by 10 US digits).'
      );
    }
    const cleanPhone = phoneCheck.formatted;

    if (!dto.password || dto.password.length < 4) {
      throw new BadRequestException('Password must be at least 4 characters long.');
    }

    // Check if phone already registered
    const existingPhone = await this.prisma.user.findUnique({
      where: { phone: cleanPhone },
    });
    if (existingPhone) {
      throw new BadRequestException(
        `An account is already registered with ${formatUsaPhoneDisplay(cleanPhone)}. Please sign in instead.`
      );
    }

    // Check if email already registered
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: cleanEmail },
    });
    if (existingEmail) {
      throw new BadRequestException(
        `An account is already registered with ${cleanEmail}. Please sign in or use forgot password.`
      );
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store pending registration payload (with securely hashed password)
    const hashedPassword = bcrypt.hashSync(dto.password, 10);
    const pendingData = {
      name: dto.name.trim(),
      phone: cleanPhone,
      email: cleanEmail,
      password: hashedPassword,
      address: dto.address?.trim() || null,
      city: dto.city?.trim() || 'New York',
    };

    // Remove any previous registration OTP for this email
    await this.prisma.emailOtp.deleteMany({
      where: { email: cleanEmail, type: 'REGISTER' },
    });

    await this.prisma.emailOtp.create({
      data: {
        email: cleanEmail,
        code: otpCode,
        type: 'REGISTER',
        data: JSON.stringify(pendingData),
        expiresAt,
      },
    });

    // Send the email via Gmail SMTP
    await this.mailService.sendRegisterOtp(cleanEmail, otpCode, dto.name);

    return {
      success: true,
      message: `A 6-digit verification code has been sent to ${cleanEmail}. Please check your inbox or spam folder.`,
      email: cleanEmail,
      phone: cleanPhone,
    };
  }

  /**
   * STEP 2: Verify OTP and create user account
   */
  async verifyRegisterOtp(dto: VerifyRegisterOtpDto) {
    if (!dto.email || !dto.code) {
      throw new BadRequestException('Email and verification code are required.');
    }

    const cleanEmail = dto.email.trim().toLowerCase();
    const cleanCode = dto.code.trim();

    const otpRecord = await this.prisma.emailOtp.findFirst({
      where: {
        email: cleanEmail,
        type: 'REGISTER',
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new BadRequestException(
        'No pending verification found for this email. Please request a new verification code.'
      );
    }

    if (new Date() > otpRecord.expiresAt) {
      await this.prisma.emailOtp.delete({ where: { id: otpRecord.id } });
      throw new BadRequestException('Verification code has expired. Please request a new one.');
    }

    if (otpRecord.code !== cleanCode) {
      throw new BadRequestException('Incorrect verification code. Please check your email and try again.');
    }

    const pendingData = JSON.parse(otpRecord.data || '{}');
    if (!pendingData.phone || !pendingData.email) {
      throw new BadRequestException('Registration session corrupted. Please start registration again.');
    }

    // Double check uniqueness right before creating
    const duplicatePhone = await this.prisma.user.findUnique({
      where: { phone: pendingData.phone },
    });
    if (duplicatePhone) {
      throw new BadRequestException('An account with this phone number already exists.');
    }

    const user = await this.prisma.user.create({
      data: {
        phone: pendingData.phone,
        name: pendingData.name,
        email: pendingData.email,
        password: pendingData.password,
        address: pendingData.address,
        city: pendingData.city,
        verified: true,
        verifiedAt: new Date(),
        role: 'CLIENT',
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        address: true,
        city: true,
        avatar: true,
        verified: true,
        role: true,
        createdAt: true,
      },
    });

    // Delete used OTP
    await this.prisma.emailOtp.deleteMany({
      where: { email: cleanEmail, type: 'REGISTER' },
    });

    const token = await this.jwtService.signAsync({
      sub: user.id,
      phone: user.phone,
      role: user.role,
      name: user.name,
      email: user.email,
    });

    return {
      success: true,
      message: `Account verified and created successfully! Welcome to ProductPerks, ${user.name}.`,
      user,
      token,
    };
  }

  /**
   * FORGOT PASSWORD - STEP 1: Send Reset OTP to Gmail
   */
  async sendForgotPasswordOtp(dto: SendForgotPasswordOtpDto) {
    if (!dto.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email.trim())) {
      throw new BadRequestException('Please provide a valid registered Gmail / email address.');
    }
    const cleanEmail = dto.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      throw new BadRequestException('No registered account was found with this email address.');
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete previous reset OTPs
    await this.prisma.emailOtp.deleteMany({
      where: { email: cleanEmail, type: 'FORGOT_PASSWORD' },
    });

    await this.prisma.emailOtp.create({
      data: {
        email: cleanEmail,
        code: otpCode,
        type: 'FORGOT_PASSWORD',
        data: JSON.stringify({ userId: user.id, name: user.name }),
        expiresAt,
      },
    });

    await this.mailService.sendForgotPasswordOtp(cleanEmail, otpCode, user.name);

    return {
      success: true,
      message: `Password reset OTP has been sent to ${cleanEmail}. Please enter the 6-digit code.`,
      email: cleanEmail,
    };
  }

  /**
   * FORGOT PASSWORD - STEP 2: Verify OTP and update password
   */
  async resetPassword(dto: ResetPasswordDto) {
    if (!dto.email || !dto.code || !dto.newPassword) {
      throw new BadRequestException('Email, verification code, and new password are required.');
    }

    if (dto.newPassword.length < 4) {
      throw new BadRequestException('New password must be at least 4 characters long.');
    }

    const cleanEmail = dto.email.trim().toLowerCase();
    const cleanCode = dto.code.trim();

    const otpRecord = await this.prisma.emailOtp.findFirst({
      where: {
        email: cleanEmail,
        type: 'FORGOT_PASSWORD',
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new BadRequestException(
        'No password reset request found for this email. Please request a new code.'
      );
    }

    if (new Date() > otpRecord.expiresAt) {
      await this.prisma.emailOtp.delete({ where: { id: otpRecord.id } });
      throw new BadRequestException('Reset code has expired. Please request a new one.');
    }

    if (otpRecord.code !== cleanCode) {
      throw new BadRequestException('Incorrect verification code. Please check your email.');
    }

    const hashedPassword = bcrypt.hashSync(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { email: cleanEmail },
      data: { password: hashedPassword },
    });

    // Remove used OTP
    await this.prisma.emailOtp.deleteMany({
      where: { email: cleanEmail, type: 'FORGOT_PASSWORD' },
    });

    return {
      success: true,
      message: 'Password has been reset successfully! You can now log in with your new password.',
    };
  }

  /**
   * Direct Register (Fallback / Admin) - enforces USA phone number validation
   */
  async register(dto: RegisterDto) {
    // Validate USA Phone
    const phoneCheck = validateAndFormatUsaPhone(dto.phone);
    if (!phoneCheck.isValid) {
      throw new BadRequestException(phoneCheck.error || 'Only USA phone numbers are allowed (+1).');
    }
    const cleanPhone = phoneCheck.formatted;

    if (!dto.password || dto.password.length < 4) {
      throw new BadRequestException('Password must be at least 4 characters.');
    }

    const existing = await this.prisma.user.findUnique({
      where: { phone: cleanPhone },
    });

    if (existing) {
      throw new BadRequestException(
        `A client is already registered with ${formatUsaPhoneDisplay(cleanPhone)}. Please log in.`
      );
    }

    const cleanEmail = dto.email ? dto.email.trim().toLowerCase() : null;
    if (cleanEmail) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: cleanEmail },
      });
      if (existingEmail) {
        throw new BadRequestException('An account is already registered with this email address.');
      }
    }

    const hashedPassword = bcrypt.hashSync(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        phone: cleanPhone,
        name: dto.name.trim(),
        password: hashedPassword,
        email: cleanEmail,
        address: dto.address ? dto.address.trim() : null,
        city: dto.city ? dto.city.trim() : 'New York',
        verified: true,
        verifiedAt: new Date(),
        role: 'CLIENT',
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        address: true,
        city: true,
        avatar: true,
        verified: true,
        role: true,
        createdAt: true,
      },
    });

    const token = await this.jwtService.signAsync({
      sub: user.id,
      phone: user.phone,
      role: user.role,
      name: user.name,
      email: user.email,
    });

    return {
      success: true,
      message: 'Account created successfully! Welcome to ProductPerks.',
      user,
      token,
    };
  }

  /**
   * Login - supports either USA Phone Number or Email
   */
  async login(dto: LoginDto) {
    const input = (dto.phoneOrEmail || dto.phone || dto.email || '').trim();

    if (!input) {
      throw new BadRequestException('Please enter your USA phone number or registered email.');
    }

    if (!dto.password) {
      throw new BadRequestException('Please enter your password.');
    }

    let user = null;

    if (input.includes('@')) {
      // Find by Email
      user = await this.prisma.user.findUnique({
        where: { email: input.toLowerCase() },
      });
    } else {
      // Find by USA Phone Number
      const phoneCheck = validateAndFormatUsaPhone(input);
      const searchPhone = phoneCheck.isValid ? phoneCheck.formatted : this.normalizePhone(input);

      user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { phone: searchPhone },
            { phone: this.normalizePhone(input) },
            { phone: `+1${this.normalizePhone(input).replace(/^\+?1/, '')}` },
          ],
        },
      });
    }

    if (!user) {
      throw new UnauthorizedException('No account found with these credentials. Please check or register.');
    }

    if (user.password) {
      const isMatch = bcrypt.compareSync(dto.password, user.password);
      if (!isMatch && dto.password !== user.password) {
        throw new UnauthorizedException('Incorrect password. Please try again or use Forgot Password.');
      }
    }

    const sanitizedUser = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      address: user.address,
      city: user.city,
      avatar: user.avatar,
      verified: user.verified,
      role: user.role,
      createdAt: user.createdAt,
    };

    const token = await this.jwtService.signAsync({
      sub: user.id,
      phone: user.phone,
      role: user.role,
      name: user.name,
      email: user.email,
    });

    return {
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: sanitizedUser,
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { id: userId },
          { phone: this.normalizePhone(userId) },
          { email: userId.toLowerCase() },
        ],
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        address: true,
        city: true,
        avatar: true,
        verified: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    return user;
  }
}
