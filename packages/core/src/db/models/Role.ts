import z from "zod";
import { getDBClient } from "@db/db";
// Schema
import roleSchema from "@schemas/roles";
// Models
import { RolePermissionT } from "@db/models/RolePermission";
// Utils
import { queryDataFormat, SelectQueryBuilder } from "@utils/app/query-helpers";

// -------------------------------------------
// Types
type RoleCreateSingle = (
  data: z.infer<typeof roleSchema.createSingle.body>
) => Promise<RoleT>;

type RoleDeleteSingle = (id: number) => Promise<RoleT>;

type RoleGetMultiple = (query_instance: SelectQueryBuilder) => Promise<{
  data: RoleT[];
  count: number;
}>;

type RoleUpdateSingle = (
  id: number,
  data: z.infer<typeof roleSchema.updateSingle.body>
) => Promise<RoleT>;

type RoleGetSingle = (id: number) => Promise<RoleT>;

type RoleGetSingleByName = (name: string) => Promise<RoleT>;

// -------------------------------------------
// User
export type RoleT = {
  id: number;
  environment_key: string;
  user_id: string;
  role_id: string;

  permissions: {
    id: RolePermissionT["id"];
    permission: RolePermissionT["permission"];
    environment_key: RolePermissionT["environment_key"];
  }[];

  created_at: string;
  updated_at: string;
};

export default class Role {
  // -------------------------------------------
  // Functions
  static createSingle: RoleCreateSingle = async (data) => {
    const client = await getDBClient();

    const { columns, aliases, values } = queryDataFormat({
      columns: ["name"],
      values: [data.name],
    });

    const roleRes = await client.query<RoleT>({
      text: `INSERT INTO lucid_roles (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value,
    });

    return roleRes.rows[0];
  };
  static deleteSingle: RoleDeleteSingle = async (id) => {
    const client = await getDBClient();

    const roleRes = await client.query<RoleT>({
      text: `DELETE FROM lucid_roles WHERE id = $1 RETURNING *`,
      values: [id],
    });

    return roleRes.rows[0];
  };
  static getMultiple: RoleGetMultiple = async (query_instance) => {
    const client = await getDBClient();

    const roles = client.query<RoleT>({
      text: `SELECT ${query_instance.query.select} FROM lucid_roles as roles ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
      values: query_instance.values,
    });

    const count = client.query<{ count: string }>({
      text: `SELECT COUNT(DISTINCT lucid_roles.id) FROM lucid_roles ${query_instance.query.where}`,
      values: query_instance.countValues,
    });

    const data = await Promise.all([roles, count]);

    return {
      data: data[0].rows,
      count: parseInt(data[1].rows[0].count),
    };
  };
  static updateSingle: RoleUpdateSingle = async (id, data) => {
    const client = await getDBClient();

    const { columns, aliases, values } = queryDataFormat({
      columns: ["name"],
      values: [data.name],
    });

    const roleRes = await client.query<RoleT>({
      text: `UPDATE lucid_roles SET ${columns.formatted.update} WHERE id = $${
        aliases.value.length + 1
      } RETURNING *`,
      values: [...values.value, id],
    });

    return roleRes.rows[0];
  };
  static getSingle: RoleGetSingle = async (id) => {
    const client = await getDBClient();

    const roleRes = await client.query<RoleT>({
      text: `SELECT 
          roles.*,
          json_agg(json_build_object(
            'id', rp.id, 
            'permission', rp.permission,
            'environment_key', rp.environment_key
          )) AS permissions
        FROM
          lucid_roles as roles
        LEFT JOIN 
          lucid_role_permissions as rp ON roles.id = rp.role_id
        WHERE 
          roles.id = $1
        GROUP BY
          roles.id`,
      values: [id],
    });

    return roleRes.rows[0];
  };
  static getSingleByName: RoleGetSingleByName = async (name) => {
    const client = await getDBClient();

    const roleRes = await client.query<RoleT>({
      text: `SELECT * FROM lucid_roles WHERE name = $1`,
      values: [name],
    });

    return roleRes.rows[0];
  };
}
