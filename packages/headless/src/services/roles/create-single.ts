import slug from "slug";
import T from "../../translations/index.js";
import { APIError, modelErrors } from "../../utils/app/error-handler.js";
import { environments } from "../../db/schema.js";
import { eq, sql } from "drizzle-orm";
import assignedBricksServices from "../assigned-bricks/index.js";
import assignedCollectionsServices from "../assigned-collections/index.js";
import getConfig from "../config.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

export interface ServiceData {
	name: string;
	permissionGroups: {
		permissions: string[];
		environment_key?: string | undefined;
	}[];
}

const createSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	// const parsePermissions = await service(
	// 	roleServices.validatePermissions,
	// 	false,
	// 	client
	//   )(data.permission_groups);
	//   // check if role name is unique
	//   await service(
	// 	roleServices.checkNameIsUnique,
	// 	false,
	// 	client
	//   )({
	// 	name: data.name,
	//   });
	//   const role = await Role.createSingle(client, {
	// 	name: data.name,
	// 	permission_groups: data.permission_groups,
	//   });
	//   if (!role) {
	// 	throw new HeadlessError({
	// 	  type: "basic",
	// 	  name: "Role Error",
	// 	  message: "There was an error creating the role.",
	// 	  status: 500,
	// 	});
	//   }
	//   if (data.permission_groups.length > 0) {
	// 	await service(
	// 	  rolePermServices.createMultiple,
	// 	  false,
	// 	  client
	// 	)({
	// 	  role_id: role.id,
	// 	  permissions: parsePermissions,
	// 	});
	//   }
	//   return formatRole(role);
};

export default createSingle;
