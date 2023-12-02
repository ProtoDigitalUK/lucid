import { PoolClient } from "pg";
// Utils
import { queryDataFormat } from "@utils/app/query-helpers.js";
// Types
import {
  PermissionT,
  EnvironmentPermissionT,
} from "@headless/types/src/permissions.js";

// -------------------------------------------
// Types

type RolePermissionCreateSingle = (
  client: PoolClient,
  data: {
    role_id: number;
    permission: PermissionT | EnvironmentPermissionT;
    environment_key?: string;
  }
) => Promise<RolePermissionT>;

type RolePermissionDeleteSingle = (
  client: PoolClient,
  data: {
    id: RolePermissionT["id"];
  }
) => Promise<RolePermissionT>;

type RolePermissionGetAll = (
  client: PoolClient,
  data: {
    role_id: number;
  }
) => Promise<RolePermissionT[]>;

type RolePermissionDeleteAll = (
  client: PoolClient,
  data: {
    role_id: number;
  }
) => Promise<RolePermissionT[]>;

// -------------------------------------------
// Role Permission
export type RolePermissionT = {
  id: number;
  role_id: string;
  permission: PermissionT | EnvironmentPermissionT;
  environment_key: string | null;

  created_at: string;
  updated_at: string;
};

export default class RolePermission {
  static createSingle: RolePermissionCreateSingle = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: ["role_id", "permission", "environment_key"],
      values: [data.role_id, data.permission, data.environment_key],
    });

    const permissionRes = await client.query<RolePermissionT>({
      text: `INSERT INTO headless_role_permissions (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value,
    });

    return permissionRes.rows[0];
  };
  static deleteSingle: RolePermissionDeleteSingle = async (client, data) => {
    const rolePermission = await client.query<RolePermissionT>({
      text: `DELETE FROM headless_role_permissions WHERE id = $1 RETURNING *`,
      values: [data.id],
    });

    return rolePermission.rows[0];
  };
  static deleteAll: RolePermissionDeleteAll = async (client, data) => {
    const res = await client.query<RolePermissionT>({
      text: `DELETE FROM headless_role_permissions WHERE role_id = $1 RETURNING *`,
      values: [data.role_id],
    });

    return res.rows;
  };
  static getAll: RolePermissionGetAll = async (client, data) => {
    const res = await client.query<RolePermissionT>({
      text: `SELECT * FROM headless_role_permissions WHERE role_id = $1`,
      values: [data.role_id],
    });

    return res.rows;
  };
}
