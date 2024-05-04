import { LucidAPIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	id: number;
}

const deleteSingle = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const EmailsRepo = Repository.get("emails", serviceConfig.db);

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
		throw new LucidAPIError({
			type: "basic",
			status: 500,
		});
	}
};

export default deleteSingle;
