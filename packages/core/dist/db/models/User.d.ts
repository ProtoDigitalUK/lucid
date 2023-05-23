type UserRegister = (data: {
    email: string;
    username: string;
    password: string;
    account_reset?: boolean;
}) => Promise<UserT>;
type UserAccountReset = (id: string, data: {
    email: string;
    password: string;
    username?: string;
}) => Promise<UserT>;
type UserGetById = (id: string) => Promise<UserT>;
type UserLogin = (username: string, password: string) => Promise<UserT>;
export type UserT = {
    id: string;
    email: string;
    username: string;
    first_name: string | null;
    last_name: string | null;
    password?: string;
    account_reset: boolean;
    created_at: string;
    updated_at: string;
};
export default class User {
    static register: UserRegister;
    static accountReset: UserAccountReset;
    static getById: UserGetById;
    static login: UserLogin;
    static checkIfUserExistsAlready: (email: string, username: string) => Promise<void>;
}
export {};
//# sourceMappingURL=User.d.ts.map