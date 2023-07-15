import { UserT } from "../../db/models/User";
import { UserPermissionsResT } from "../format/format-user-permissions";
export interface UserResT {
    id: number;
    super_admin?: boolean;
    email: string;
    username: string;
    first_name: string | null;
    last_name: string | null;
    roles?: UserPermissionsResT["roles"];
    permissions?: UserPermissionsResT["permissions"];
    created_at: string;
    updated_at: string;
}
declare const formatUser: (user: UserT, permissions?: UserPermissionsResT) => UserResT;
export default formatUser;
//# sourceMappingURL=format-user.d.ts.map