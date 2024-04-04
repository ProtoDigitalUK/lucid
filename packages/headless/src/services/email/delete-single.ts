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
	const EmailsRepo = RepositoryFactory.getRepository(
		"emails",
		serviceConfig.db,
	);

	const deleteEmail = await EmailsRepo.deleteSingle({
		where: [
			{
				key: "id",
				operator: "=",
				value: data.id,
			},
		],
	});

	if (deleteEmail === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_deleted_name", {
				name: T("email"),
			}),
			message: T("deletion_error_message", {
				name: T("email").toLowerCase(),
			}),
			status: 500,
		});
	}
};

export default deleteSingle;
