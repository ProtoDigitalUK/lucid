import { expect, test } from "vitest";
import CustomFieldSchema from "../schema.js";
import DocumentCustomField from "./document.js";

const CONSTANTS = {
	collectionBrickId: "collection-pseudo-brick",
};

// -----------------------------------------------
// Validation

// TODO: needs adding

// -----------------------------------------------
// Custom field config
test("custom field config passes schema validation", async () => {
	const field = new DocumentCustomField("field", {
		labels: {
			title: {
				en: "title",
			},
			description: {
				en: "description",
			},
		},
		translations: true,
		collection: "page",
		hidden: false,
		disabled: false,
		validation: {
			required: true,
		},
	});

	const res = await CustomFieldSchema.safeParseAsync(field.config);
	expect(res.success).toBe(true);
});
