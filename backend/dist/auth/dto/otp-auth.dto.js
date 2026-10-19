export class SendRegisterOtpDto {
    name;
    phone;
    email;
    password;
    address;
    city;
}
export class VerifyRegisterOtpDto {
    email;
    code;
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