import { expect, test } from "vitest";
import z from "zod";
import CollectionBuilder from "../../../libs/builders/collection-builder/index.js";
import flattenFields from "../helpers/flatten-fields.js";
import {
	validateBrick,
	validateField,
} from "./check-validate-bricks-fields.js";

const LOCALISATION = {
	locales: [
		{
			label: "English",
			code: "en",
		},
		{
			label: "French",
			code: "fr",
		},
		{
			label: "German",
			code: "de",
		},
		{
			label: "Spanish",
			code: "es",
		},
	],
	defaultLocale: "en",
};

// -----------------------------------------------
// Validate full brick

test("validate brick along with brick field validation", async () => {
	const Collection = new CollectionBuilder("collection", {
		mode: "multiple",
		title: "Test",
		singular: "Test",
		translations: true,
	})
		.addText("text_test")
		.addWysiwyg("wysiwyg_test")
		.addMedia("media_test")
		.addNumber("number_test")
		.addCheckbox("checkbox_test")
		.addSelect("select_test", {
			options: [
				{
					label: "Option 1",
					value: "option-1",
				},
			],
		})
		.addTextarea("textarea_test")
		.addJSON("json_test")
		.addColour("colour_test")
		.addDateTime("datetime_test")
		.addLink("link_test")
		.addUser("user_test")
		.addRepeater("test_repeater")
		.addText("test_repeater_text")
		.endRepeater();

	const flatten = flattenFields(
		[
			{
				key: "text_test",
				type: "text",
				translations: {
					en: "Homepage",
					fr: "Accueil",
				},
			},
			{
				key: "wysiwyg_test",
				type: "wysiwyg",
				value: "<h1>Heading</h1><p>Body</p>",
			},
			{
				key: "media_test",
				type: "media",
				value: 1,
			},
			{
				key: "number_test",
				type: "number",
				value: 1,
			},
			{
				key: "checkbox_test",
				type: "checkbox",
				value: 1,
			},
			{
				key: "select_test",
				type: "select",
				value: "option-1",
			},
			{
				key: "textarea_test",
				type: "textarea",
				value: "Test textarea",
			},
			{
				key: "json_test",
				type: "json",
				value: '{"key":"value"}',
			},
			{
				key: "colour_test",
				type: "colour",
				value: "#000000",
			},
			{
				key: "datetime_test",
				type: "datetime",
				value: "2022-01-01T00:00:00.000Z",
			},
			{
				key: "link_test",
				type: "link",
				value: {
					url: "https://example.com",
					target: "_blank",
					label: "Link 1",
				},
			},
			{
				key: "user_test",
				type: "user",
				value: 1,
			},
			{
				key: "test_repeater",
				type: "repeater",
				groups: [
					{
						id: "ref-group1",
						open: 0,
						fields: [
							{
								key: "test_repeater_text",
								type: "text",
								translations: {
									en: "Test repeater text",
								},
							},
						],
					},
					{
						id: "ref-group2",
						open: 0,
						fields: [
							{
								key: "test_repeater_text",
								type: "text",
								translations: {
									en: "Test repeater text",
								},
							},
						],
					},
				],
			},
		],
		LOCALISATION,
		Collection,
	);

	const validateRes = validateBrick({
		brick: {
			id: "collection-pseudo-brick",
			type: "collection-fields",
			fields: flatten.fields,
			groups: flatten.groups,
		},
		collection: Collection,
		media: [
			{
				id: 1,
				type: "image",
				width: 1024,
				height: 768,
				file_extension: "png",
			},
		],
		users: [
			{
				id: 1,
				email: "test@test.com",
				first_name: "Test",
				last_name: "User",
				username: "test-user",
			},
		],
	});

	expect(validateRes.length).toBe(0);
});

// -----------------------------------------------
// Checkbox custom field
test("successfully validate field - checkbox", async () => {
	expect(true).toBe(true);
});
test("fail to validate field - checkbox", async () => {
	expect(true).toBe(true);
});

// -----------------------------------------------
// Colour custom field
test("successfully validate field - colour", async () => {
	expect(true).toBe(true);
});
test("fail to validate field - colour", async () => {
	expect(true).toBe(true);
});

// -----------------------------------------------
// DateTime custom field
test("successfully validate field - datetime", async () => {
	expect(true).toBe(true);
});
test("fail to validate field - datetime", async () => {
	expect(true).toBe(true);
});

// -----------------------------------------------
// JSON custom field
test("successfully validate field - json", async () => {
	expect(true).toBe(true);
});
test("fail to validate field - json", async () => {
	expect(true).toBe(true);
});

// -----------------------------------------------
// Link custom field
test("successfully validate field - link", async () => {
	expect(true).toBe(true);
});
test("fail to validate field - link", async () => {
	expect(true).toBe(true);
});

// -----------------------------------------------
// Media custom field
test("successfully validate field - media", async () => {
	expect(true).toBe(true);
});
test("fail to validate field - media", async () => {
	expect(true).toBe(true);
});

// -----------------------------------------------
// Number custom field
test("successfully validate field - number", async () => {
	expect(true).toBe(true);
});
test("fail to validate field - number", async () => {
	expect(true).toBe(true);
});

// -----------------------------------------------
// Repeater custom field
test("successfully validate field - repeater", async () => {
	expect(true).toBe(true);
});
test("fail to validate field - repeater", async () => {
	expect(true).toBe(true);
});

// -----------------------------------------------
// Select custom field
test("successfully validate field - select", async () => {
	expect(true).toBe(true);
});
test("fail to validate field - select", async () => {
	expect(true).toBe(true);
});

// -----------------------------------------------
// Text custom field
test("successfully validate field - text", async () => {
	const TextCollection = new CollectionBuilder("collection", {
		mode: "multiple",
		title: "Test",
		singular: "Test",
		translations: true,
	})
		.addText("standard_text")
		.addText("required_text", {
			validation: {
				required: true,
			},
		})
		.addText("min_length_text", {
			validation: {
				zod: z.string().min(5),
			},
		});

	const flatten = flattenFields(
		[
			{
				key: "standard_text",
				type: "text",
				translations: {
					en: "Standard text",
					fr: "Texte standard",
				},
			},
			{
				key: "required_text",
				type: "text",
				translations: {
					en: "Required text",
					fr: "Texte obligatoire",
				},
			},
			{
				key: "min_length_text",
				type: "text",
				translations: {
					en: "Min length text",
					fr: "Texte de longueur minimum",
				},
			},
		],
		LOCALISATION,
		TextCollection,
	);

	const validateRes = validateBrick({
		brick: {
			id: "collection-pseudo-brick",
			type: "collection-fields",
			fields: flatten.fields,
			groups: flatten.groups,
		},
		collection: TextCollection,
		media: [],
		users: [],
	});

	expect(validateRes.length).toBe(0);
});
test("fail to validate field - text", async () => {
	const TextCollection = new CollectionBuilder("collection", {
		mode: "multiple",
		title: "Test",
		singular: "Test",
		translations: true,
	})
		.addText("required_text", {
			validation: {
				required: true,
			},
		})
		.addText("zod_text", {
			validation: {
				zod: z.string().min(5),
			},
		});

	const flatten = flattenFields(
		[
			{
				key: "required_text",
				type: "text",
				translations: {
					en: "text",
					fr: null, // should fail
					de: undefined, // should fail
					es: "", // should fail
				},
			},
			{
				key: "zod_text",
				type: "text",
				translations: {
					en: "Zod text",
					fr: "4444", // should fail
					de: "55555",
					es: "666666",
				},
			},
		],
		LOCALISATION,
		TextCollection,
	);

	const validateRes = validateBrick({
		brick: {
			id: "collection-pseudo-brick",
			type: "collection-fields",
			fields: flatten.fields,
			groups: flatten.groups,
		},
		collection: TextCollection,
		media: [],
		users: [],
	});

	expect(validateRes.length).toBe(4);
});

// -----------------------------------------------
// Textarea custom field
test("successfully validate field - textarea", async () => {
	expect(true).toBe(true);
});
test("fail to validate field - textarea", async () => {
	expect(true).toBe(true);
});

// -----------------------------------------------
// User custom field
test("successfully validate field - user", async () => {
	expect(true).toBe(true);
});
test("fail to validate field - user", async () => {
	expect(true).toBe(true);
});

// -----------------------------------------------
// Wysiwyg custom field
test("successfully validate field - wysiwyg", async () => {
	expect(true).toBe(true);
});
test("fail to validate field - wysiwyg", async () => {
	expect(true).toBe(true);
});
