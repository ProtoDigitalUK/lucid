import getDBClient from "@db/db";
// Utils
import { queryDataFormat } from "@utils/app/query-helpers";
// Services
import { PermissionT, EnvironmentPermissionT } from "@services/permissions";

// -------------------------------------------
// Types

type RolePermissionCreateSingle = (
  role_id: number,
  permission: PermissionT | EnvironmentPermissionT,
  environment_key?: string
) => Promise<RolePermissionT>;

type RolePermissionDeleteSingle = (
  id: RolePermissionT["id"]
) => Promise<RolePermissionT>;

type RolePermissionGetAll = (role_id: number) => Promise<RolePermissionT[]>;

type RolePermissionDeleteAll = (role_id: number) => Promise<RolePermissionT[]>;

// -------------------------------------------
// User
export type RolePermissionT = {
  id: number;
  role_id: string;
  permission: PermissionT | EnvironmentPermissionT;
  environment_key: string | null;

  created_at: string;
  updated_at: string;
};

export default class RolePermission {
  // -------------------------------------------
  // Functions
  static createSingle: RolePermissionCreateSingle = async (
    role_id,
    permission,
    environment_key
  ) => {
    const client = await getDBClient;

    const { columns, aliases, values } = queryDataFormat({
      columns: ["role_id", "permission", "environment_key"],
      values: [role_id, permission, environment_key],
    });

    const permissionRes = await client.query<RolePermissionT>({
      text: `INSERT INTO lucid_role_permissions (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value,
    });

    return permissionRes.rows[0];
  };
  static deleteSingle: RolePermissionDeleteSingle = async (id) => {
    const client = await getDBClient;

    const rolePermission = await client.query<RolePermissionT>({
      text: `DELETE FROM lucid_role_permissions WHERE id = $1 RETURNING *`,
      values: [id],
    });

    return rolePermission.rows[0];
  };
  static deleteAll: RolePermissionDeleteAll = async (role_id) => {
    const client = await getDBClient;

    const res = await client.query<RolePermissionT>({
      text: `DELETE FROM lucid_role_permissions WHERE role_id = $1 RETURNING *`,
      values: [role_id],
    });

    return res.rows;
  };
  static getAll: RolePermissionGetAll = async (role_id) => {
    const client = await getDBClient;

    const res = await client.query<RolePermissionT>({
      text: `SELECT * FROM lucid_role_permissions WHERE role_id = $1`,
      values: [role_id],
    });

    return res.rows;
  };
}
