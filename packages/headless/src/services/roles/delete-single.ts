import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import RepositoryFactory from "../../libs/repositories/index.js";

export interface ServiceData {
	id: number;
}

const deleteSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const RolesRepo = RepositoryFactory.getRepository(
		"roles",
		serviceConfig.db,
	);

	const deleteRoles = await RolesRepo.deleteMultiple({
		where: [
			{
				key: "id",
				operator: "=",
				value: data.id,
			},
		],
	});

	if (deleteRoles.length === 0) {
		throw new APIError({
			type: "basic",
			name: T("error_not_deleted_name", {
				name: T("role"),
			}),
			message: T("deletion_error_message", {
				name: T("role").toLowerCase(),
			}),
			status: 500,
		});
	}
};

export default deleteSingle;
