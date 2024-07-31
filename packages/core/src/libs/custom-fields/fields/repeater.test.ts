import { expect, test } from "vitest";
import CustomFieldSchema from "../schema.js";
import RepeaterCustomField from "./repeater.js";

// -----------------------------------------------
// Custom field config
test("custom field config passes schema validation", async () => {
	const field = new RepeaterCustomField("field", {
		labels: {
			title: {
				en: "title",
			},
			description: {
				en: "description",
			},
		},
		disabled: false,
		validation: {
			maxGroups: 3,
		},
	});

	const res = await CustomFieldSchema.safeParseAsync(field.config);
	expect(res.success).toBe(true);
});
