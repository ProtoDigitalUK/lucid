import { createStore } from "solid-js/store";
// Types
import { UserResT } from "@headless/types/src/users";
import {
  PermissionT,
  EnvironmentPermissionT,
} from "@headless/types/src/permissions";

type UserStoreT = {
  user: UserResT | null;
  reset: () => void;

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

const [get, set] = createStore<UserStoreT>({
  user: null,
  reset() {
    set("user", null);
  },

  // -----------------
  // Permissions
  hasPermission(perm: PermissionT[]) {
    if (this.user?.super_admin) return { all: true, some: true };

    const userPerms = this.user?.permissions?.global;
    if (!userPerms) return { all: false, some: false };

    const all = perm.every((p) => userPerms.includes(p));
    const some = perm.some((p) => userPerms.includes(p));

    return { all, some };
  },
  hasEnvPermission(perm: EnvironmentPermissionT[], key: string) {
    if (this.user?.super_admin) return { all: true, some: true };

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
