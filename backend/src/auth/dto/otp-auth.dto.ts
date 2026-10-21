export class SendRegisterOtpDto {
  name: string;
  phone: string;
  email: string;
  password: string;
  address?: string;
  city?: string;
  amazonProfileUrl?: string;
  paypalEmail?: string;
}

export class VerifyRegisterOtpDto {
  email: string;
  code: string;
  selfieImage?: string;
  amazonProfileUrl?: string;
  paypalEmail?: string;
}

export class SendForgotPasswordOtpDto {
  email: string;
}

export class ResetPasswordDto {
  email: string;
  code: string;
  newPassword: string;
}
