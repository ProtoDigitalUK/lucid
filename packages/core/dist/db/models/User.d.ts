type UserRegister = (data: {
    email: string;
    username: string;
    password: string;
    super_admin?: boolean;
}) => Promise<UserT>;
type UserGetById = (id: number) => Promise<UserT>;
type UserGetByUsername = (data: {
    username: string;
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
    static checkIfUserExistsAlready: (email: string, username: string) => Promise<void>;
}
export {};
//# sourceMappingURL=User.d.ts.map