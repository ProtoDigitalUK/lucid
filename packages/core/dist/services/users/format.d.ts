import { UserT } from "../../db/models/User";
import { UserResT } from "../users";
import { UserPermissionsRes } from "../users/format-permissions";
declare const formatUser: (user: UserT, permissions?: UserPermissionsRes) => UserResT;
export default formatUser;
//# sourceMappingURL=format.d.ts.map