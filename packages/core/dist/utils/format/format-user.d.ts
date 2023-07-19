import { UserT } from "../../db/models/User";
import { UserPermissionsResT, UserResT } from "@lucid/types/src/users";
declare const formatUser: (user: UserT, permissions?: UserPermissionsResT) => UserResT;
export default formatUser;
//# sourceMappingURL=format-user.d.ts.map