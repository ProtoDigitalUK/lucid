import { expect, test } from "vitest";
import TextCustomField from "./fields/text.js";
import CustomFieldSchema from "./schema.js";

test("custom field config passes schema validation", async () => {
	const textField = new TextCustomField("text_test", {
		labels: {
			title: {
				en: "Title",
			},
			description: {
				en: "The title of the text field.",
			},
			placeholder: {
				en: "Title",
			},
		},
		validation: {
			required: true,
		},
	});

	const res = await CustomFieldSchema.safeParseAsync(textField.config);
	expect(res.success).toBe(true);
});
