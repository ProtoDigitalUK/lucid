import { PoolClient } from "pg";
import { SelectQueryBuilder } from "../../utils/app/query-helpers";
type UserGetMultiple = (client: PoolClient, query_instance: SelectQueryBuilder) => Promise<{
    data: UserT[];
    count: number;
}>;
type UserRegister = (client: PoolClient, data: {
    first_name?: string;
    last_name?: string;
    email: string;
    username: string;
    password: string;
    super_admin?: boolean;
}) => Promise<UserT>;
type UserGetById = (client: PoolClient, data: {
    id: number;
}) => Promise<UserT>;
type UserGetByUsername = (client: PoolClient, data: {
    username: string;
}) => Promise<UserT>;
type UserGetByEmail = (client: PoolClient, data: {
    email: string;
}) => Promise<UserT>;
type UserGetByEmailAndUsername = (client: PoolClient, data: {
    email: string;
    username: string;
}) => Promise<UserT>;
type UserDeleteSingle = (client: PoolClient, data: {
    id: number;
}) => Promise<UserT>;
type UserUpdatePassword = (client: PoolClient, data: {
    id: number;
    password: string;
}) => Promise<UserT>;
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
    static register: UserRegister;
    static getMultiple: UserGetMultiple;
    static getById: UserGetById;
    static getByUsername: UserGetByUsername;
    static getByEmail: UserGetByEmail;
    static getByEmailAndUsername: UserGetByEmailAndUsername;
    static deleteSingle: UserDeleteSingle;
    static updatePassword: UserUpdatePassword;
}
export {};
//# sourceMappingURL=User.d.ts.map