export interface ServiceData {
    hashedPassword: string;
    password: string;
}
declare const validatePassword: (data: ServiceData) => Promise<boolean>;
export default validatePassword;
//# sourceMappingURL=validate-password.d.ts.map