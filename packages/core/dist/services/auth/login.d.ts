interface ServiceData {
    username: string;
    password: string;
}
declare const login: (data: ServiceData) => Promise<import("../../db/models/User").UserT>;
export default login;
//# sourceMappingURL=login.d.ts.map