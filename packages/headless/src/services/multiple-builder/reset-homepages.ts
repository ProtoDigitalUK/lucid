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
	page_id?: number;
}

const resetHomepages = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const defaultLanguage = await serviceConfig.db
		.selectFrom("headless_languages")
		.select(["id"])
		.where("is_default", "=", true)
		.executeTakeFirst();

	const defaultLanguageId = defaultLanguage?.id || null;

	// get all homepages for the collection with their default title translations
	// generate slug from title translation if it exists or make new one
	// Update the docuemnts with new slug and set homepage to false

	const [homepages] = await Promise.all([
		serviceConfig.db
			.selectFrom("headless_collection_multiple_builder")
			.select(["headless_collection_multiple_builder.id"])
			.leftJoin("headless_translations as title_translations", (join) =>
				join
					.onRef(
						"title_translations.translation_key_id",
						"=",
						"headless_collection_multiple_builder.title_translation_key_id",
					)
					.on(
						"title_translations.language_id",
						"=",
						defaultLanguageId,
					),
			)
			.select(["title_translations.value as title_translation_value"])
			.groupBy([
				"headless_collection_multiple_builder.id",
				"title_translations.value",
			])
			.where(
				"headless_collection_multiple_builder.collection_key",
				"=",
				data.collection_key,
			)
			.where("headless_collection_multiple_builder.homepage", "=", true)
			.where(
				"headless_collection_multiple_builder.id",
				"!=",
				data.exclude_id,
			)
			.execute(),
		data.page_id !== undefined
			? serviceConfig.db
					.updateTable("headless_collection_multiple_builder")
					.where("parent_id", "=", data.page_id)
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
			homepage.title_translation_value ||
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
				.updateTable("headless_collection_multiple_builder")
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
