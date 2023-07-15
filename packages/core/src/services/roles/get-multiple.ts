import z from "zod";
// Utils
import { SelectQueryBuilder } from "@utils/app/query-helpers";
// Models
import Role from "@db/models/Role";
// Schema
import rolesSchema from "@schemas/roles";
import rolePermService from "@services/role-permissions";

export interface ServiceData {
  query: z.infer<typeof rolesSchema.getMultiple.query>;
}

const getMultiple = async (data: ServiceData) => {
  const { filter, sort, page, per_page, include } = data.query;

  // Build Query Data and Query
  const SelectQuery = new SelectQueryBuilder({
    columns: ["roles.id", "roles.name", "roles.created_at", "roles.updated_at"],
    exclude: undefined,
    filter: {
      data: filter,
      meta: {
        name: {
          operator: "%",
          type: "text",
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

  const roles = await Role.getMultiple(SelectQuery);

  if (include && include.includes("permissions")) {
    const permissionsPromise = roles.data.map((role) =>
      rolePermService.getAll({
        role_id: role.id,
      })
    );
    const permissions = await Promise.all(permissionsPromise);
    roles.data = roles.data.map((role, index) => {
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
    data: roles.data,
    count: roles.count,
  };
};

export default getMultiple;
