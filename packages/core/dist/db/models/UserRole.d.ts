import formatPermissions from "../../services/users/format-permissions";
type UserRoleUpdate = (id: string, data: {
    role_ids: number[];
}) => Promise<UserRoleT[]>;
type UserRoleGetPermissions = (id: number) => Promise<ReturnType<typeof formatPermissions>>;
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
    static update: UserRoleUpdate;
    static getPermissions: UserRoleGetPermissions;
}
export {};
//# sourceMappingURL=UserRole.d.ts.map