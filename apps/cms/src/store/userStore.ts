import { createStore } from "solid-js/store";
// Types
import type { PermissionT } from "@headless/types/src/permissions"; // TODO: remove
import type { UserResponse } from "@protoheadless/core/types";

type UserStoreT = {
	user: UserResponse | null;
	reset: () => void;

	hasPermission: (_perm: PermissionT[]) => {
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

		const userPerms = this.user?.permissions;
		if (!userPerms) return { all: false, some: false };

		const all = perm.every((p) => userPerms.includes(p));
		const some = perm.some((p) => userPerms.includes(p));

		return { all, some };
	},
});

const userStore = {
	get,
	set,
};

export default userStore;
