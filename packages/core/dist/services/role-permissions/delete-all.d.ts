export interface ServiceData {
    role_id: number;
}
declare const deleteAll: (data: ServiceData) => Promise<import("../../db/models/RolePermission").RolePermissionT[]>;
export default deleteAll;
//# sourceMappingURL=delete-all.d.ts.map