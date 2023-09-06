import { UserT } from "../../db/models/User.js";
import { UserPermissionsResT, UserResT } from "@lucid/types/src/users.js";
declare const formatUser: (user: UserT, permissions?: UserPermissionsResT) => UserResT;
export default formatUser;
//# sourceMappingURL=format-user.d.ts.map