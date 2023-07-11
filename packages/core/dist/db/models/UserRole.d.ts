type UserRoleGetAll = (user_id: number) => Promise<UserRoleT[]>;
type UserRoleUpdate = (id: number, data: {
    role_ids: number[];
}) => Promise<UserRoleT[]>;
type UserRoleGetPermissions = (user_id: number) => Promise<UserRolePermissionRes[]>;
type UserRoleDeleteMultiple = (user_id: number, role_ids: number[]) => Promise<UserRoleT[]>;
export interface UserRolePermissionRes {
    permission: string;
    environment_key: string;
    role_id: number;
    role_name: string;
}
export type UserRoleT = {
    id: number;
    user_id: number;
    role_id: number;
    created_at: string;
    updated_at: string;
};
export default class UserRole {
    static getAll: UserRoleGetAll;
    static updateRoles: UserRoleUpdate;
    static deleteMultiple: UserRoleDeleteMultiple;
    static getPermissions: UserRoleGetPermissions;
}
export {};
//# sourceMappingURL=UserRole.d.ts.map