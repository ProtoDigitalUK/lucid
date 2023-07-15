import { PoolClient } from "pg";
type UserTokenCreateSingle = (client: PoolClient, data: {
    user_id: number;
    token_type: UserTokenT["token_type"];
    token: string;
    expiry_date: string;
}) => Promise<UserTokenT>;
type UserTokenGetByToken = (client: PoolClient, data: {
    token: string;
    token_type: UserTokenT["token_type"];
}) => Promise<UserTokenT>;
type UserTokenDeleteSingle = (client: PoolClient, data: {
    id: number;
}) => Promise<UserTokenT>;
type UserTokenRemoveExpiredTokens = (client: PoolClient) => Promise<UserTokenT[]>;
export type UserTokenT = {
    id: number;
    user_id: number;
    token_type: "password_reset";
    token: string;
    created_at: string;
    expiry_date: string;
};
export default class UserToken {
    static createSingle: UserTokenCreateSingle;
    static getByToken: UserTokenGetByToken;
    static deleteSingle: UserTokenDeleteSingle;
    static removeExpiredTokens: UserTokenRemoveExpiredTokens;
}
export {};
//# sourceMappingURL=UserToken.d.ts.map