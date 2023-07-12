export interface ServiceData {
    email: string;
    username: string;
    password: string;
}
declare const registerSuperAdmin: (data: ServiceData) => Promise<import("../users").UserResT>;
export default registerSuperAdmin;
//# sourceMappingURL=register-superadmin.d.ts.map