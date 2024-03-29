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
		serviceConfig.db
			.updateTable("headless_collection_documents")
			.set({
				homepage: 0,
			})
			.where(
				"headless_collection_documents.collection_key",
				"=",
				data.collection_key,
			)
			.where("headless_collection_documents.homepage", "=", 1)
			.where("headless_collection_documents.id", "!=", data.exclude_id)
			.execute(),
		data.document_id !== undefined
			? serviceConfig.db
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
