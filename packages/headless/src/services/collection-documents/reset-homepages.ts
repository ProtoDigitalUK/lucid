export interface ServiceData {
	collection_key: string;
	exclude_id: number;
	document_id?: number;
}

const resetHomepages = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	await Promise.all([
		serviceConfig.config.db.client
			.updateTable("headless_collection_documents")
			.set({
				homepage: false,
			})
			.where(
				"headless_collection_documents.collection_key",
				"=",
				data.collection_key,
			)
			.where("headless_collection_documents.homepage", "=", true)
			.where("headless_collection_documents.id", "!=", data.exclude_id)
			.execute(),
		data.document_id !== undefined
			? serviceConfig.config.db.client
					.updateTable("headless_collection_documents")
					.where("parent_id", "=", data.document_id)
					.set({
						parent_id: null,
					})
					.execute()
			: undefined,
	]);
};

export default resetHomepages;
