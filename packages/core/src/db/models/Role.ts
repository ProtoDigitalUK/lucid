import client from "@db/db";
import constants from "@root/constants";
// Utils
import { LucidError, modelErrors } from "@utils/error-handler";
import { queryDataFormat } from "@utils/query-helpers";

// -------------------------------------------
// Types
type RoleCreateSingle = (data: {
  name: string;
  permissions: Array<string>;
}) => Promise<RoleT>;

// -------------------------------------------
// User
export type RoleT = {
  id: string;
  environment_key: string;
  user_id: string;
  role_id: string;

  permissions: string[];

  created_at: string;
  updated_at: string;
};

export type RolePermissionT = {
  id: string;
  role_id: string;
  permission: string;

  created_at: string;
  updated_at: string;
};

export default class Role {
  // -------------------------------------------
  // Functions
  static createSingle: RoleCreateSingle = async (data) => {
    const roleRes = await client.query<RoleT>({
      text: `INSERT INTO lucid_roles (name) VALUES ($1) RETURNING *`,
      values: [data.name],
    });

    let role = roleRes.rows[0];

    if (!role) {
      throw new LucidError({
        type: "basic",
        name: "Role Error",
        message: "There was an error creating the role.",
        status: 500,
        errors: modelErrors({
          name: {
            code: "Not unique",
            message: "The role name must be unique.",
          },
        }),
      });
    }

    if (data.permissions.length > 0) {
      const permissions = await Role.#addRolePermissions(
        role.id,
        data.permissions
      );
      role.permissions = permissions.map((perm) => perm.permission);
    }

    return role;
  };
  // -------------------------------------------
  // Util Functions
  static #addRolePermissions = async (
    role_id: string,
    permissions: Array<string>
  ) => {
    const promiseRes = permissions.map(async (permission) => {
      const permRes = await client.query<RolePermissionT>({
        text: `INSERT INTO lucid_role_permissions (role_id, permission) VALUES ($1, $2) RETURNING *`,
        values: [role_id, permission],
      });

      if (!permRes.rows[0]) {
        throw new LucidError({
          type: "basic",
          name: "Role Error",
          message: "There was an error creating the role permissions.",
          status: 500,
        });
      }

      return permRes.rows[0];
    });

    const res = await Promise.all(promiseRes);
    return res;
  };
}
