export class SendRegisterOtpDto {
    name;
    phone;
    email;
    password;
    address;
    city;
    amazonProfileUrl;
    paypalEmail;
}
export class VerifyRegisterOtpDto {
    email;
    code;
    selfieImage;
    amazonProfileUrl;
    paypalEmail;
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