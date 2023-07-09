interface ServiceData {
    email: string;
    username: string;
    password: string;
}
declare const registerSuperAdmin: (data: ServiceData) => Promise<import("../../db/models/User").UserT>;
export default registerSuperAdmin;
//# sourceMappingURL=register-superadmin.d.ts.map