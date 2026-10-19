export declare class SendRegisterOtpDto {
    name: string;
    phone: string;
    email: string;
    password: string;
    address?: string;
    city?: string;
}
export declare class VerifyRegisterOtpDto {
    email: string;
    code: string;
}
export declare class SendForgotPasswordOtpDto {
    email: string;
}
export declare class ResetPasswordDto {
    email: string;
    code: string;
    newPassword: string;
}
