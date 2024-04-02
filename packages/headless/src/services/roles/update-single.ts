import T from "../../translations/index.js";
import { APIError, modelErrors } from "../../utils/error-handler.js";
import rolesServices from "./index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import RepositoryFactory from "../../libs/factories/repository-factory.js";

export interface ServiceData {
	id: number;
	name?: string;
	description?: string;
	permissions?: string[];
}

const updateSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const RolesRepo = RepositoryFactory.getRepository(
		"roles",
		serviceConfig.db,
	);

	const [validatePerms, checkNameIsUnique] = await Promise.all([
		data.permissions !== undefined
			? serviceWrapper(rolesServices.validatePermissions, false)(
					serviceConfig,
					{
						permissions: data.permissions,
					},
			  )
			: undefined,
		data.name !== undefined
			? RolesRepo.getSingle({
					select: ["id"],
					where: [
						{
							key: "name",
							operator: "=",
							value: data.name,
						},
						{
							key: "id",
							operator: "!=",
							value: data.id,
						},
					],
			  })
			: undefined,
	]);

	if (data.name !== undefined && checkNameIsUnique !== undefined) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: T("role"),
			}),
			message: T("not_unique_error_message"),
			status: 400,
			errors: modelErrors({
				name: {
					code: "invalid",
					message: T("not_unique_error_message"),
				},
			}),
		});
	}
	const updateRoleRes = await RolesRepo.updateSingle({
		data: {
			name: data.name,
			description: data.description,
			updatedAt: new Date().toISOString(),
		},
		where: [
			{
				key: "id",
				operator: "=",
				value: data.id,
			},
		],
	});

	if (updateRoleRes === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_updated_name", {
				name: T("role"),
			}),
			message: T("update_error_message", {
				name: T("role").toLowerCase(),
			}),
			status: 400,
		});
	}

	if (validatePerms !== undefined) {
		await serviceConfig.db
			.deleteFrom("headless_role_permissions")
			.where("role_id", "=", data.id)
			.executeTakeFirst();

		if (validatePerms.length > 0) {
			await serviceConfig.db
				.insertInto("headless_role_permissions")
				.values(
					validatePerms.map((permission) => ({
						role_id: data.id,
						permission: permission.permission,
					})),
				)
				.execute();
		}
	}
};

export default updateSingle;
