type UserTokenCreateSingle = (data: {
    user_id: number;
    token_type: UserTokenT["token_type"];
    token: string;
    expiry_date: string;
}) => Promise<UserTokenT>;
type UserTokenGetByToken = (data: {
    token: string;
    token_type: UserTokenT["token_type"];
}) => Promise<UserTokenT>;
type UserTokenDeleteSingle = (data: {
    id: number;
}) => Promise<UserTokenT>;
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
    static removeExpiredTokens: () => Promise<UserTokenT>;
}
export {};
//# sourceMappingURL=UserToken.d.ts.map