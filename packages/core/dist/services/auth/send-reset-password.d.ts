export interface ServiceData {
    email: string;
}
declare const sendResetPassword: (data: ServiceData) => Promise<{
    message: string;
}>;
export default sendResetPassword;
//# sourceMappingURL=send-reset-password.d.ts.map