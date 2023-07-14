export interface ServiceData {
    first_name?: string;
    last_name?: string;
    email: string;
    username: string;
    password: string;
    super_admin?: boolean;
}
declare const registerSingle: (data: ServiceData) => Promise<import("../../utils/format/format-user").UserResT>;
export default registerSingle;
//# sourceMappingURL=register-single.d.ts.map