import z from "zod";
import roleSchema from "../../schemas/roles";
type RoleCreateSingle = (data: z.infer<typeof roleSchema.createSingle.body>) => Promise<RoleT>;
type RoleDeleteSingle = (id: number) => Promise<RoleT>;
type RoleGetMultiple = (ids: number[]) => Promise<RoleT[]>;
export type RoleT = {
    id: number;
    environment_key: string;
    user_id: string;
    role_id: string;
    permissions: string[];
    created_at: string;
    updated_at: string;
};
export default class Role {
    static createSingle: RoleCreateSingle;
    static deleteSingle: RoleDeleteSingle;
    static getMultiple: RoleGetMultiple;
}
export {};
//# sourceMappingURL=Role.d.ts.map