import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	id: number;
	user_id?: number;
}

const deleteSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const CollectionDocumentsRepo = Repository.get(
		"collection-documents",
		serviceConfig.db,
	);

	const deletePage = await CollectionDocumentsRepo.updateSingle({
		where: [
			{
				key: "id",
				operator: "=",
				value: data.id,
			},
		],
		data: {
			isDeleted: 1,
			isDeletedAt: new Date().toISOString(),
			deletedBy: data.user_id,
		},
	});

	if (deletePage === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_deleted_name", {
				name: T("document"),
			}),
			message: T("deletion_error_message", {
				name: T("document").toLowerCase(),
			}),
			status: 500,
		});
	}
};

export default deleteSingle;
