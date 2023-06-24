import { PermissionT } from "../models/RolePermission";
import { UserRoleRes, UserEnvrionmentRes } from "../../services/users/format-permissions";
type UserRegister = (data: {
    email: string;
    username: string;
    password: string;
    account_reset?: boolean;
    super_admin?: boolean;
}) => Promise<UserT>;
type UserAccountReset = (id: number, data: {
    email: string;
    password: string;
    username?: string;
}) => Promise<UserT>;
type UserGetById = (id: number) => Promise<UserT>;
type UserLogin = (data: {
    username: string;
    password: string;
}) => Promise<UserT>;
type UserUpdateSingle = (id: number, data: {}) => Promise<UserT>;
export type UserT = {
    id: number;
    super_admin: boolean;
    email: string;
    username: string;
    first_name: string | null;
    last_name: string | null;
    password?: string;
    account_reset: boolean;
    roles?: UserRoleRes[];
    permissions?: {
        global: PermissionT[];
        environments?: UserEnvrionmentRes[];
    };
    created_at: string;
    updated_at: string;
};
export default class User {
    static register: UserRegister;
    static accountReset: UserAccountReset;
    static getById: UserGetById;
    static login: UserLogin;
    static updateSingle: UserUpdateSingle;
    static checkIfUserExistsAlready: (email: string, username: string) => Promise<void>;
}
export {};
//# sourceMappingURL=User.d.ts.map