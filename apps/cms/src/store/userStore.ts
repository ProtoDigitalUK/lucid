import { createStore } from "solid-js/store";
import { getCookie } from "@/utils/cookie";
// Types
import { UserResT } from "@lucid/types/src/users";
import {
  PermissionT,
  EnvironmentPermissionT,
} from "@lucid/types/src/permissions";

type AuthStore = {
  user: UserResT | null;
  isAuthenticated: () => boolean;

  hasPerm: (_perm: PermissionT) => boolean;
  hasEnvPerm: (_key: string, _perm: EnvironmentPermissionT) => boolean;
  hasSomeEnvPerms: (_key: string) => boolean;
};

const [get, set] = createStore<AuthStore>({
  user: null,
  isAuthenticated() {
    const authCookie = getCookie("auth");
    return authCookie !== null;
  },

  // -----------------
  // Permissions
  hasPerm(perm: PermissionT) {
    const userPerms = this.user?.permissions?.global;
    if (!userPerms) return false;

    return userPerms.includes(perm);
  },
  hasEnvPerm(key: string, perm: EnvironmentPermissionT) {
    const userEnvPerms = this.user?.permissions?.environments;
    if (!userEnvPerms) return false;

    const envPerm = userEnvPerms.find((env) => env.key === key);
    if (!envPerm) return false;

    return envPerm.permissions.includes(perm);
  },
  hasSomeEnvPerms(key: string) {
    const userEnvPerms = this.user?.permissions?.environments;
    if (!userEnvPerms) return false;

    const envPerm = userEnvPerms.find((env) => env.key === key);
    if (!envPerm) return false;

    return envPerm.permissions.length > 0;
  },
});

const userStore = {
  get,
  set,
};

export default userStore;
