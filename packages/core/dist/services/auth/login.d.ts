export interface ServiceData {
    username: string;
    password: string;
}
declare const login: (data: ServiceData) => Promise<import("../users").UserResT>;
export default login;
//# sourceMappingURL=login.d.ts.map