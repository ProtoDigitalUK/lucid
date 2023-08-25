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

  hasPermission: (_perm: PermissionT[]) => {
    all: boolean;
    some: boolean;
  };
  hasEnvPermission: (
    _perm: EnvironmentPermissionT[],
    _key: string
  ) => {
    all: boolean;
    some: boolean;
  };
};

const [get, set] = createStore<AuthStore>({
  user: null,
  isAuthenticated() {
    const authCookie = getCookie("auth");
    return authCookie !== null;
  },

  // -----------------
  // Permissions
  hasPermission(perm: PermissionT[]) {
    const userPerms = this.user?.permissions?.global;
    if (!userPerms) return { all: false, some: false };

    const all = perm.every((p) => userPerms.includes(p));
    const some = perm.some((p) => userPerms.includes(p));

    return { all, some };
  },
  hasEnvPermission(perm: EnvironmentPermissionT[], key: string) {
    const userEnvPerms = this.user?.permissions?.environments;
    if (!userEnvPerms) return { all: false, some: false };

    const envPerm = userEnvPerms.find((env) => env.key === key);
    if (!envPerm) return { all: false, some: false };

    const all = perm.every((p) => envPerm.permissions.includes(p));
    const some = perm.some((p) => envPerm.permissions.includes(p));

    return { all, some };
  },
});

const userStore = {
  get,
  set,
};

export default userStore;
