export interface ServiceData {
    role_id: number;
}
declare const getAll: (data: ServiceData) => Promise<import("../../db/models/RolePermission").RolePermissionT[]>;
export default getAll;
//# sourceMappingURL=get-all.d.ts.map