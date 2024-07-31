import { expect, test } from "vitest";
import CustomFieldSchema from "../schema.js";
import TabCustomField from "./tab.js";

// -----------------------------------------------
// Custom field config
test("custom field config passes schema validation", async () => {
	const field = new TabCustomField("field", {
		labels: {
			title: {
				en: "title",
			},
			description: {
				en: "description",
			},
		},
	});

	const res = await CustomFieldSchema.safeParseAsync(field.config);
	expect(res.success).toBe(true);
});
