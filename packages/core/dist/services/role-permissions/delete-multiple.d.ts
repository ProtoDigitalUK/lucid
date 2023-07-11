export interface ServiceData {
    ids: number[];
}
declare const deleteMultiple: (data: ServiceData) => Promise<import("../../db/models/RolePermission").RolePermissionT[]>;
export default deleteMultiple;
//# sourceMappingURL=delete-multiple.d.ts.map