import slug from "slug";
import {
	uniqueNamesGenerator,
	adjectives,
	colors,
	animals,
} from "unique-names-generator";

export interface ServiceData {
	collection_key: string;
	exclude_id: number;
	document_id?: number;
}

const resetHomepages = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const [homepages] = await Promise.all([
		serviceConfig.db
			.selectFrom("headless_collection_documents")
			.select(["headless_collection_documents.id"])
			.where(
				"headless_collection_documents.collection_key",
				"=",
				data.collection_key,
			)
			.where("headless_collection_documents.homepage", "=", true)
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

	if (homepages.length === 0) {
		return;
	}

	const newHomepageData = homepages.map((homepage) => {
		const slugValue = slug(
			uniqueNamesGenerator({
				dictionaries: [adjectives, colors, animals],
				separator: "-",
				length: 2,
			}),
			{ lower: true },
		);
		return {
			id: homepage.id,
			slug: slugValue,
		};
	});

	await Promise.all(
		newHomepageData.map((homepage) => {
			return serviceConfig.db
				.updateTable("headless_collection_documents")
				.set({
					slug: homepage.slug,
					homepage: false,
				})
				.where("id", "=", homepage.id)
				.execute();
		}),
	);
};

export default resetHomepages;
