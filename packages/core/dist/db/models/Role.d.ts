import { PoolClient } from "pg";
import z from "zod";
import roleSchema from "../../schemas/roles";
import { RolePermissionT } from "../models/RolePermission";
import { SelectQueryBuilder } from "../../utils/app/query-helpers";
type RoleCreateSingle = (client: PoolClient, data: z.infer<typeof roleSchema.createSingle.body>) => Promise<RoleT>;
type RoleDeleteSingle = (client: PoolClient, data: {
    id: number;
}) => Promise<RoleT>;
type RoleGetMultiple = (client: PoolClient, query_instance: SelectQueryBuilder) => Promise<{
    data: RoleT[];
    count: number;
}>;
type RoleUpdateSingle = (client: PoolClient, data: {
    id: number;
    data: z.infer<typeof roleSchema.updateSingle.body>;
}) => Promise<RoleT>;
type RoleGetSingle = (client: PoolClient, data: {
    id: number;
}) => Promise<RoleT>;
type RoleGetSingleByName = (client: PoolClient, data: {
    name: string;
}) => Promise<RoleT>;
export type RoleT = {
    id: number;
    environment_key: string;
    user_id: string;
    role_id: string;
    permissions: {
        id: RolePermissionT["id"];
        permission: RolePermissionT["permission"];
        environment_key: RolePermissionT["environment_key"];
    }[];
    created_at: string;
    updated_at: string;
};
export default class Role {
    static createSingle: RoleCreateSingle;
    static deleteSingle: RoleDeleteSingle;
    static getMultiple: RoleGetMultiple;
    static updateSingle: RoleUpdateSingle;
    static getSingle: RoleGetSingle;
    static getSingleByName: RoleGetSingleByName;
}
export {};
//# sourceMappingURL=Role.d.ts.map