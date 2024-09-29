import { expect, test } from "vitest";
import buildFullSlugFromSlugs from "./build-fullslug-from-slugs.js";
import type { DescendantFieldsResponse } from "../services/get-descendant-fields.js";

const descendants: Array<DescendantFieldsResponse> = [
	{
		collection_document_id: 1,
		collection_document_version_id: 101,
		fields: [
			{
				key: "slug",
				collection_document_id: 1,
				collection_document_version_id: 101,
				locale_code: "en",
				text_value: "test",
				document_id: null,
			},
			{
				key: "parentPage",
				collection_document_id: 1,
				collection_document_version_id: 101,
				locale_code: "en",
				text_value: null,
				document_id: 2,
			},
		],
	},
	{
		collection_document_id: 2,
		collection_document_version_id: 102,
		fields: [
			{
				key: "slug",
				collection_document_id: 2,
				collection_document_version_id: 102,
				locale_code: "en",
				text_value: "parent",
				document_id: null,
			},
			{
				key: "parentPage",
				collection_document_id: 2,
				collection_document_version_id: 102,
				locale_code: "en",
				text_value: null,
				document_id: 3,
			},
		],
	},
	{
		collection_document_id: 3,
		collection_document_version_id: 103,
		fields: [
			{
				key: "slug",
				collection_document_id: 3,
				collection_document_version_id: 103,
				locale_code: "en",
				text_value: "grandparent",
				document_id: null,
			},
			{
				key: "parentPage",
				collection_document_id: 3,
				collection_document_version_id: 103,
				locale_code: "en",
				text_value: null,
				document_id: null,
			},
		],
	},
];

test("should return correctly formatted and built fullSlug", async () => {
	const testFullSlug = buildFullSlugFromSlugs({
		targetLocale: "en",
		currentDescendant: descendants[0] as DescendantFieldsResponse,
		descendants: descendants,
		topLevelFullSlug: undefined,
	});
	const grandparentFullSlug = buildFullSlugFromSlugs({
		targetLocale: "en",
		currentDescendant: descendants[2] as DescendantFieldsResponse,
		descendants: descendants,
		topLevelFullSlug: undefined,
	});
	expect(testFullSlug).toBe("/grandparent/parent/test");
	expect(grandparentFullSlug).toBe("/grandparent");
});

test("should prepend topLevelFullSlug to fullSlug if it exists", async () => {
	const testFullSlug = buildFullSlugFromSlugs({
		targetLocale: "en",
		currentDescendant: descendants[0] as DescendantFieldsResponse,
		descendants: descendants,
		topLevelFullSlug: "/top-level",
	});
	const grandparentFullSlug = buildFullSlugFromSlugs({
		targetLocale: "en",
		currentDescendant: descendants[2] as DescendantFieldsResponse,
		descendants: descendants,
		topLevelFullSlug:
			"//top-level" /* double slashes to test that they are removed */,
	});
	expect(testFullSlug).toBe("/top-level/grandparent/parent/test");
	expect(grandparentFullSlug).toBe("/top-level/grandparent");
});
