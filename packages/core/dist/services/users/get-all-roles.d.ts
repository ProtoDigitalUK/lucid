export interface ServiceData {
    user_id: number;
}
declare const getAllRoles: (data: ServiceData) => Promise<import("../../db/models/UserRole").UserRoleT[]>;
export default getAllRoles;
//# sourceMappingURL=get-all-roles.d.ts.map