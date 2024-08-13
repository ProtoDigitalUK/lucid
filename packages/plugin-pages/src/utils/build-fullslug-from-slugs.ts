import constants from "../constants.js";
import type { DescendantFieldsResponse } from "../services/get-descendant-fields.js";

const buildFullSlugFromSlugs = (data: {
	targetLocale: string;
	currentDescendant: DescendantFieldsResponse;
	descendants: Array<DescendantFieldsResponse>;
	topLevelFullSlug?: string;
}): string | null => {
	const slugField = data.currentDescendant.fields.find(
		(field) =>
			field.locale_code === data.targetLocale &&
			field.key === constants.fields.slug.key,
	);

	if (!slugField || !slugField.text_value) return null;

	const slugFieldValue = slugField.text_value;

	const parentPageField = data.currentDescendant.fields.find(
		(field) => field.key === constants.fields.parentPage.key,
	);

	if (!parentPageField || !parentPageField.document_id) {
		return postSlugFormat(
			data.topLevelFullSlug
				? `${data.topLevelFullSlug}/${slugFieldValue}`
				: slugFieldValue,
		);
	}

	const parentDescendant = data.descendants.find(
		(descendant) =>
			descendant.collection_document_id === parentPageField.document_id,
	);

	if (!parentDescendant) {
		return postSlugFormat(
			data.topLevelFullSlug
				? `/${data.topLevelFullSlug}/${slugFieldValue}`
				: slugFieldValue,
		);
	}

	const parentFullSlug = buildFullSlugFromSlugs({
		targetLocale: data.targetLocale,
		currentDescendant: parentDescendant,
		descendants: data.descendants,
		topLevelFullSlug: data.topLevelFullSlug,
	});

	const fullSlug = parentFullSlug
		? `/${parentFullSlug}/${slugFieldValue}`
		: slugFieldValue;

	if (data.topLevelFullSlug === undefined) {
		return postSlugFormat(fullSlug);
	}

	return postSlugFormat(
		parentFullSlug ? fullSlug : `/${data.topLevelFullSlug}/${fullSlug}`,
	);
};

const postSlugFormat = (slug: string | null): string | null => {
	if (!slug) return null;
	let res = slug;
	if (!res.startsWith("/")) {
		res = `/${res}`;
	}
	return res.replace(/\/\//g, "/");
};

export default buildFullSlugFromSlugs;
