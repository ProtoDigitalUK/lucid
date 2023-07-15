type UserRegister = (data: {
    first_name?: string;
    last_name?: string;
    email: string;
    username: string;
    password: string;
    super_admin?: boolean;
}) => Promise<UserT>;
type UserGetById = (id: number) => Promise<UserT>;
type UserGetByUsername = (data: {
    username: string;
}) => Promise<UserT>;
type UserGetByEmail = (data: {
    email: string;
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
    static getById: UserGetById;
    static getByUsername: UserGetByUsername;
    static getByEmail: UserGetByEmail;
    static checkIfUserExistsAlready: (email: string, username: string) => Promise<UserT>;
    static deleteSingle: (id: number) => Promise<UserT>;
    static updatePassword: (id: number, password: string) => Promise<UserT>;
}
export {};
//# sourceMappingURL=User.d.ts.map