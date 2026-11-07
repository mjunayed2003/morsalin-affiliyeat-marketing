export class SendRegisterOtpDto {
    name;
    phone;
    email;
    password;
    address;
    city;
    amazonProfileUrl;
}
export class VerifyRegisterOtpDto {
    email;
    code;
    selfieImage;
    amazonProfileUrl;
}
export class SendForgotPasswordOtpDto {
    email;
}
export class ResetPasswordDto {
    email;
    code;
    newPassword;
}
//# sourceMappingURL=otp-auth.dto.js.map