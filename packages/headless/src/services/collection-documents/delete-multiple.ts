import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import RepositoryFactory from "../../libs/repositories/index.js";

export interface ServiceData {
	ids: number[];
	user_id?: number;
}

const deleteMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.ids.length === 0) return;

	const CollectionDocumentsRepo = RepositoryFactory.getRepository(
		"collection-documents",
		serviceConfig.db,
	);

	const deletePages = await CollectionDocumentsRepo.updateMultiple({
		where: [
			{
				key: "id",
				operator: "in",
				value: data.ids,
			},
		],
		data: {
			isDeleted: 1,
			isDeletedAt: new Date().toISOString(),
			deletedBy: data.user_id,
		},
	});

	if (deletePages.length === 0) {
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

export default deleteMultiple;
