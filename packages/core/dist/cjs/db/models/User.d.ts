import { PoolClient } from "pg";
import { SelectQueryBuilder } from "../../utils/app/query-helpers.js";
type UserGetMultiple = (client: PoolClient, query_instance: SelectQueryBuilder) => Promise<{
    data: UserT[];
    count: number;
}>;
type UserCreateSingle = (client: PoolClient, data: {
    first_name?: string;
    last_name?: string;
    email: string;
    username: string;
    password: string;
    super_admin?: boolean;
}) => Promise<UserT>;
type UserDeleteSingle = (client: PoolClient, data: {
    id: number;
}) => Promise<UserT>;
type UserUpdateSingle = (client: PoolClient, data: {
    user_id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    email?: string;
    password?: string;
    super_admin?: boolean;
}) => Promise<{
    id: UserT["id"];
}>;
type UserGetSingle = (client: PoolClient, query_instance: SelectQueryBuilder) => Promise<UserT>;
export type UserT = {
    id: number;
    super_admin: boolean;
    email: string;
    username: string;
    first_name: string | null;
    last_name: string | null;
    password?: string;
    created_at: string;
    updated_at: string;
};
export default class User {
    static createSingle: UserCreateSingle;
    static getMultiple: UserGetMultiple;
    static updateSingle: UserUpdateSingle;
    static deleteSingle: UserDeleteSingle;
    static getSingle: UserGetSingle;
}
export {};
//# sourceMappingURL=User.d.ts.map