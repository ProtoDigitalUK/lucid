import z from "zod";
import client from "@db/db";
// Schema
import roleSchema from "@schemas/roles";
// Utils
import { LucidError, modelErrors } from "@utils/error-handler";
import { queryDataFormat, SelectQueryBuilder } from "@utils/query-helpers";
// Models
import RolePermission, { RolePermissionT } from "@db/models/RolePermission";
// Services
import validatePermissions from "@services/roles/validate-permissions";

// -------------------------------------------
// Types
type RoleCreateSingle = (
  data: z.infer<typeof roleSchema.createSingle.body>
) => Promise<RoleT>;
type RoleDeleteSingle = (id: number) => Promise<RoleT>;
type RoleGetMultiple = (
  query: z.infer<typeof roleSchema.getMultiple.query>
) => Promise<{
  data: RoleT[];
  count: number;
}>;
type RoleUpdateSingle = (
  id: number,
  data: z.infer<typeof roleSchema.updateSingle.body>
) => Promise<RoleT>;
type RoleGetSingle = (id: number) => Promise<RoleT>;

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
    const { columns, aliases, values } = queryDataFormat(["name"], [data.name]);

    const parsePermissions = await validatePermissions(data.permission_groups);

    // check if role name is unique
    await Role.#roleNameUnique(data.name);

    const roleRes = await client.query<RoleT>({
      text: `INSERT INTO lucid_roles (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value,
    });

    let role = roleRes.rows[0];

    if (!role) {
      throw new LucidError({
        type: "basic",
        name: "Role Error",
        message: "There was an error creating the role.",
        status: 500,
      });
    }

    if (data.permission_groups.length > 0) {
      try {
        await RolePermission.createMultiple(role.id, parsePermissions);
      } catch (error) {
        await Role.deleteSingle(role.id);
        throw error;
      }
    }

    return role;
  };
  static deleteSingle: RoleDeleteSingle = async (id) => {
    const roleRes = await client.query<RoleT>({
      text: `DELETE FROM lucid_roles WHERE id = $1 RETURNING *`,
      values: [id],
    });

    let role = roleRes.rows[0];

    if (!role) {
      throw new LucidError({
        type: "basic",
        name: "Role Error",
        message: "There was an error deleting the role.",
        status: 500,
      });
    }

    return role;
  };
  static getMultiple: RoleGetMultiple = async (query) => {
    const { filter, sort, page, per_page, include } = query;

    // Build Query Data and Query
    const SelectQuery = new SelectQueryBuilder({
      columns: [
        "roles.id",
        "roles.name",
        "roles.created_at",
        "roles.updated_at",
      ],
      exclude: undefined,
      filter: {
        data: filter,
        meta: {
          name: {
            operator: "ILIKE",
            type: "string",
            columnType: "standard",
          },
          role_ids: {
            key: "id",
            operator: "=",
            type: "int",
            columnType: "standard",
          },
        },
      },
      sort: sort,
      page: page,
      per_page: per_page,
    });

    const roles = await client.query<RoleT>({
      text: `SELECT
          ${SelectQuery.query.select}
        FROM
          lucid_roles as roles
        ${SelectQuery.query.where}
        ${SelectQuery.query.order}
        ${SelectQuery.query.pagination}`,
      values: SelectQuery.values,
    });

    const count = await client.query<{ count: number }>({
      text: `SELECT 
          COUNT(DISTINCT lucid_roles.id)
        FROM
          lucid_roles
        ${SelectQuery.query.where}`,
      values: SelectQuery.countValues,
    });

    if (include && include.includes("permissions")) {
      const permissionsPromise = roles.rows.map((role) =>
        RolePermission.getAll(role.id)
      );
      const permissions = await Promise.all(permissionsPromise);
      roles.rows = roles.rows.map((role, index) => {
        return {
          ...role,
          permissions: permissions[index].map((permission) => {
            return {
              id: permission.id,
              permission: permission.permission,
              environment_key: permission.environment_key,
            };
          }),
        };
      });
    }

    return {
      data: roles.rows,
      count: count.rows[0].count,
    };
  };
  static updateSingle: RoleUpdateSingle = async (id, data) => {
    const { columns, aliases, values } = queryDataFormat(["name"], [data.name]);
    const parsePermissions = await validatePermissions(data.permission_groups);

    await Role.#roleNameUnique(data.name, id);

    const roleRes = await client.query<RoleT>({
      text: `UPDATE lucid_roles SET ${columns.formatted.update} WHERE id = $${
        aliases.value.length + 1
      } RETURNING *`,
      values: [...values.value, id],
    });

    let role = roleRes.rows[0];

    if (!role) {
      throw new LucidError({
        type: "basic",
        name: "Role Error",
        message: "There was an error updating the role.",
        status: 500,
      });
    }

    if (data.permission_groups.length > 0) {
      await RolePermission.deleteAll(id);
      await RolePermission.createMultiple(id, parsePermissions);
    }

    return role;
  };
  static getSingle: RoleGetSingle = async (id) => {
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

    let role = roleRes.rows[0];

    if (!role) {
      throw new LucidError({
        type: "basic",
        name: "Role Error",
        message: "There was an error getting the role.",
        status: 500,
      });
    }

    return role;
  };
  // -------------------------------------------
  // Util Functions
  static #roleNameUnique = async (name: string, id?: number) => {
    const roleCheck = await client.query<RoleT>({
      text: `SELECT * FROM lucid_roles WHERE name = $1 AND id != $2`,
      values: [name, id],
    });

    if (roleCheck.rows.length > 0) {
      throw new LucidError({
        type: "basic",
        name: "Role Error",
        message: "The role name must be unique.",
        status: 500,
        errors: modelErrors({
          name: {
            code: "Not unique",
            message: "The role name must be unique.",
          },
        }),
      });
    }
  };
}
