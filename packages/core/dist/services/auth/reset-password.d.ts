export interface ServiceData {
    token: string;
    password: string;
}
declare const resetPassword: (data: ServiceData) => Promise<{
    message: string;
}>;
export default resetPassword;
//# sourceMappingURL=reset-password.d.ts.map