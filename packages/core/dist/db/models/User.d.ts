import { PermissionT } from "../models/RolePermission";
import { UserRoleRes, UserEnvrionmentRes } from "../../utils/users/format-permissions";
type UserRegister = (data: {
    email: string;
    username: string;
    password: string;
    super_admin?: boolean;
}) => Promise<UserT>;
type UserGetById = (id: number) => Promise<UserT>;
type UserLogin = (data: {
    username: string;
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
    static registerSuperAdmin: UserRegister;
    static getById: UserGetById;
    static login: UserLogin;
    static updateSingle: UserUpdateSingle;
    static checkIfUserExistsAlready: (email: string, username: string) => Promise<void>;
    static validatePassword: (hashedPassword: string, password: string) => Promise<boolean>;
}
export {};
//# sourceMappingURL=User.d.ts.map