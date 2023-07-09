export interface ServiceData {
    user_id: number;
    role_ids: number[];
}
declare const updateRoles: (data: ServiceData) => Promise<import("../../db/models/UserRole").UserRoleT[]>;
export default updateRoles;
//# sourceMappingURL=update-roles.d.ts.map