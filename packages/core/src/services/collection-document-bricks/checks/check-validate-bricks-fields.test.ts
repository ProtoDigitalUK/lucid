import { expect, test } from "vitest";
import T from "../../../translations/index.js";
import z, { boolean } from "zod";
import constants from "../../../constants/constants.js";
import CollectionBuilder from "../../../libs/builders/collection-builder/index.js";
import flattenFields from "../helpers/flatten-fields.js";
import {
	validateBrick,
	validateField,
} from "./check-validate-bricks-fields.js";

const CONSTANTS = {
	localisation: {
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
	},
	collectionBrickId: "collection-pseudo-brick",
	selectOptions: [
		{
			label: "Option 1",
			value: "option-1",
		},
		{
			label: "Option 2",
			value: "option-2",
		},
		{
			label: "Option 3",
			value: "option-3",
		},
	],
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
				value: {
					key: "value",
				},
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
		CONSTANTS.localisation,
		Collection,
	);

	const validateRes = validateBrick({
		brick: {
			id: CONSTANTS.collectionBrickId,
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
const CheckboxCollection = new CollectionBuilder("collection", {
	mode: "multiple",
	title: "Test",
	singular: "Test",
	translations: true,
})
	.addCheckbox("standard_checkbox")
	.addCheckbox("required_chekbox", {
		validation: {
			required: true,
		},
	});

test("successfully validate field - checkbox", async () => {
	// Standard
	const standardValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "standard_checkbox",
			type: "checkbox",
			value: 0,
			localeCode: "en",
		},
		instance: CheckboxCollection,
		media: [],
		users: [],
	});
	expect(standardValidate).toBe(null);

	// Required
	const requiredValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "required_chekbox",
			type: "checkbox",
			value: 1,
			localeCode: "en",
		},
		instance: CheckboxCollection,
		media: [],
		users: [],
	});
	expect(requiredValidate).toBe(null);
});
test("fail to validate field - checkbox", async () => {
	// Standard
	const standardValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "standard_checkbox",
			type: "checkbox",
			value: "1",
			localeCode: "en",
		},
		instance: CheckboxCollection,
		media: [],
		users: [],
	});
	expect(standardValidate).toEqual({
		key: "standard_checkbox",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message:
			"Invalid literal value, expected 1, or Invalid literal value, expected 0, or Expected boolean, received string", // zod error message
	});

	// Required
	const requiredValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "required_chekbox",
			type: "checkbox",
			value: 0,
			localeCode: "en",
		},
		instance: CheckboxCollection,
		media: [],
		users: [],
	});
	expect(requiredValidate).toEqual({
		key: "required_chekbox",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: T("checkbox_field_required"),
	});
});

// -----------------------------------------------
// Colour custom field
const ColourCollection = new CollectionBuilder("collection", {
	mode: "multiple",
	title: "Test",
	singular: "Test",
	translations: true,
})
	.addColour("standard_colour")
	.addColour("required_colour", {
		validation: {
			required: true,
		},
	});
test("successfully validate field - colour", async () => {
	// Standard
	const standardValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "standard_colour",
			type: "colour",
			value: "#000000",
			localeCode: "en",
		},
		instance: ColourCollection,
		media: [],
		users: [],
	});
	expect(standardValidate).toBe(null);

	// Required
	const requiredValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "required_colour",
			type: "colour",
			value: "#000000",
			localeCode: "en",
		},
		instance: ColourCollection,
		media: [],
		users: [],
	});
	expect(requiredValidate).toBe(null);
});
test("fail to validate field - colour", async () => {
	// Standard
	const standardValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "standard_colour",
			type: "colour",
			value: 0,
			localeCode: "en",
		},
		instance: ColourCollection,
		media: [],
		users: [],
	});
	expect(standardValidate).toEqual({
		key: "standard_colour",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: "Expected string, received number", // zod error message
	});

	// Required
	const requiredValidate = {
		empty: validateField({
			brickId: CONSTANTS.collectionBrickId,
			field: {
				key: "required_colour",
				type: "colour",
				value: "",
				localeCode: "en",
			},
			instance: ColourCollection,
			media: [],
			users: [],
		}),
		null: validateField({
			brickId: CONSTANTS.collectionBrickId,
			field: {
				key: "required_colour",
				type: "colour",
				value: null,
				localeCode: "en",
			},
			instance: ColourCollection,
			media: [],
			users: [],
		}),
		undefined: validateField({
			brickId: CONSTANTS.collectionBrickId,
			field: {
				key: "required_colour",
				type: "colour",
				value: undefined,
				localeCode: "en",
			},
			instance: ColourCollection,
			media: [],
			users: [],
		}),
	};
	expect(requiredValidate).toEqual({
		empty: {
			key: "required_colour",
			brickId: CONSTANTS.collectionBrickId,
			localeCode: "en",
			groupId: undefined,
			message: T("generic_field_required"),
		},
		null: {
			key: "required_colour",
			brickId: CONSTANTS.collectionBrickId,
			localeCode: "en",
			groupId: undefined,
			message: T("generic_field_required"),
		},
		undefined: {
			key: "required_colour",
			brickId: CONSTANTS.collectionBrickId,
			localeCode: "en",
			groupId: undefined,
			message: T("generic_field_required"),
		},
	});
});

// -----------------------------------------------
// DateTime custom field
const DateTimeCollection = new CollectionBuilder("collection", {
	mode: "multiple",
	title: "Test",
	singular: "Test",
	translations: true,
})
	.addDateTime("standard_datetime")
	.addDateTime("required_datetime", {
		validation: {
			required: true,
		},
	});
test("successfully validate field - datetime", async () => {
	// Standard
	const standardValidate = {
		string: validateField({
			brickId: CONSTANTS.collectionBrickId,
			field: {
				key: "standard_datetime",
				type: "datetime",
				value: "2024-06-15T14:14:21.704Z",
				localeCode: "en",
			},
			instance: DateTimeCollection,
			media: [],
			users: [],
		}),
		number: validateField({
			brickId: CONSTANTS.collectionBrickId,
			field: {
				key: "standard_datetime",
				type: "datetime",
				value: 1676103221704,
				localeCode: "en",
			},
			instance: DateTimeCollection,
			media: [],
			users: [],
		}),
		date: validateField({
			brickId: CONSTANTS.collectionBrickId,
			field: {
				key: "standard_datetime",
				type: "datetime",
				value: new Date("2024-06-15T14:14:21.704Z"),
				localeCode: "en",
			},
			instance: DateTimeCollection,
			media: [],
			users: [],
		}),
	};
	expect(standardValidate).toEqual({
		date: null,
		number: null,
		string: null,
	});

	// Required
	const requiredValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "required_datetime",
			type: "datetime",
			value: "2024-06-15T14:14:21.704Z",
			localeCode: "en",
		},
		instance: DateTimeCollection,
		media: [],
		users: [],
	});
	expect(requiredValidate).toBe(null);
});
test("fail to validate field - datetime", async () => {
	// Standard
	const standardValidate = {
		boolean: validateField({
			brickId: CONSTANTS.collectionBrickId,
			field: {
				key: "standard_datetime",
				type: "datetime",
				value: true,
				localeCode: "en",
			},
			instance: DateTimeCollection,
			media: [],
			users: [],
		}),
		string: validateField({
			brickId: CONSTANTS.collectionBrickId,
			field: {
				key: "standard_datetime",
				type: "datetime",
				value: "string",
				localeCode: "en",
			},
			instance: DateTimeCollection,
			media: [],
			users: [],
		}),
		invalid: validateField({
			brickId: CONSTANTS.collectionBrickId,
			field: {
				key: "standard_datetime",
				type: "datetime",
				value: "20024-06-15T14:14:21.704",
				localeCode: "en",
			},
			instance: DateTimeCollection,
			media: [],
			users: [],
		}),
	};
	expect(standardValidate).toEqual({
		boolean: {
			key: "standard_datetime",
			brickId: CONSTANTS.collectionBrickId,
			localeCode: "en",
			groupId: undefined,
			message:
				"Expected string, received boolean, or Expected number, received boolean, or Expected date, received boolean", // zod error message
		},
		string: {
			key: "standard_datetime",
			brickId: CONSTANTS.collectionBrickId,
			localeCode: "en",
			groupId: undefined,
			message: T("field_date_invalid"),
		},
		invalid: {
			key: "standard_datetime",
			brickId: CONSTANTS.collectionBrickId,
			localeCode: "en",
			groupId: undefined,
			message: T("field_date_invalid"),
		},
	});

	// Required
	const requiredValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "required_datetime",
			type: "datetime",
			value: "",
			localeCode: "en",
		},
		instance: DateTimeCollection,
		media: [],
		users: [],
	});
	expect(requiredValidate).toEqual({
		key: "required_datetime",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: T("generic_field_required"),
	});
});

// -----------------------------------------------
// JSON custom field
const JSONCollection = new CollectionBuilder("collection", {
	mode: "multiple",
	title: "Test",
	singular: "Test",
	translations: true,
})
	.addJSON("standard_json")
	.addJSON("required_json", {
		validation: {
			required: true,
		},
	})
	.addJSON("zod_json", {
		validation: {
			zod: z.object({
				key: z.string(),
				value: z.string(),
			}),
		},
	});
test("successfully validate field - json", async () => {
	// Standard
	const standardValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "standard_json",
			type: "json",
			value: {
				key: "value",
			},
			localeCode: "en",
		},
		instance: JSONCollection,
		media: [],
		users: [],
	});
	expect(standardValidate).toBe(null);

	// Required
	const requiredValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "required_json",
			type: "json",
			value: {
				key: "value",
			},
			localeCode: "en",
		},
		instance: JSONCollection,
		media: [],
		users: [],
	});
	expect(requiredValidate).toBe(null);

	// Zod
	const zodValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "zod_json",
			type: "json",
			value: {
				key: "value",
				value: "value",
			},
			localeCode: "en",
		},
		instance: JSONCollection,
		media: [],
		users: [],
	});
	expect(zodValidate).toBe(null);
});
test("fail to validate field - json", async () => {
	// Standard
	const standardValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "standard_json",
			type: "json",
			value: "invalid json",
			localeCode: "en",
		},
		instance: JSONCollection,
		media: [],
		users: [],
	});
	expect(standardValidate).toEqual({
		key: "standard_json",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: "Expected object, received string", // zod error message
	});

	// Required
	const requiredValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "required_json",
			type: "json",
			value: undefined,
			localeCode: "en",
		},
		instance: JSONCollection,
		media: [],
		users: [],
	});
	expect(requiredValidate).toEqual({
		key: "required_json",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: T("generic_field_required"),
	});

	// Zod
	const zodValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "zod_json",
			type: "json",
			value: {
				key: "value",
				value: true, // not a string
			},
			localeCode: "en",
		},
		instance: JSONCollection,
		media: [],
		users: [],
	});
	expect(zodValidate).toEqual({
		key: "zod_json",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: 'Expected string, received boolean at "value"', // zod error message
	});
});

// -----------------------------------------------
// Link custom field
const LinkCollection = new CollectionBuilder("collection", {
	mode: "multiple",
	title: "Test",
	singular: "Test",
	translations: true,
})
	.addLink("standard_link")
	.addLink("required_link", {
		validation: {
			required: true,
		},
	});
test("successfully validate field - link", async () => {
	// Standard
	const standardValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "standard_link",
			type: "link",
			value: {
				url: "https://example.com",
				target: "_blank",
				label: "Link 1",
			},
			localeCode: "en",
		},
		instance: LinkCollection,
		media: [],
		users: [],
	});
	expect(standardValidate).toBe(null);

	// Required
	const requiredValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "required_link",
			type: "link",
			value: {
				url: "https://example.com",
				target: "_blank",
				label: "Link 1",
			},
			localeCode: "en",
		},
		instance: LinkCollection,
		media: [],
		users: [],
	});
	expect(requiredValidate).toBe(null);
});
test("fail to validate field - link", async () => {
	// Standard
	const standardValidate = {
		url: validateField({
			brickId: CONSTANTS.collectionBrickId,
			field: {
				key: "standard_link",
				type: "link",
				value: {
					url: false, // invalid
					target: "_blank",
					label: "Link 1",
				},
				localeCode: "en",
			},
			instance: LinkCollection,
			media: [],
			users: [],
		}),
		target: validateField({
			brickId: CONSTANTS.collectionBrickId,
			field: {
				key: "standard_link",
				type: "link",
				value: {
					url: "https://example.com",
					target: "test", // invalid
					label: "Link 1",
				},
				localeCode: "en",
			},
			instance: LinkCollection,
			media: [],
			users: [],
		}),
		label: validateField({
			brickId: CONSTANTS.collectionBrickId,
			field: {
				key: "standard_link",
				type: "link",
				value: {
					url: "https://example.com",
					target: "_blank",
					label: false, // invalid
				},
				localeCode: "en",
			},
			instance: LinkCollection,
			media: [],
			users: [],
		}),
	};
	expect(standardValidate).toEqual({
		url: {
			key: "standard_link",
			brickId: CONSTANTS.collectionBrickId,
			localeCode: "en",
			groupId: undefined,
			message: 'Expected string, received boolean at "url"', // zod error message
		},
		target: {
			key: "standard_link",
			brickId: CONSTANTS.collectionBrickId,
			localeCode: "en",
			groupId: undefined,
			message: T("field_link_target_error_message", {
				valid: constants.customFields.link.targets.join(", "),
			}),
		},
		label: {
			key: "standard_link",
			brickId: CONSTANTS.collectionBrickId,
			localeCode: "en",
			groupId: undefined,
			message: 'Expected string, received boolean at "label"', // zod error message
		},
	});

	// Required
	const requiredValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "required_link",
			type: "link",
			value: undefined,
			localeCode: "en",
		},
		instance: LinkCollection,
		media: [],
		users: [],
	});
	expect(requiredValidate).toEqual({
		key: "required_link",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: T("generic_field_required"),
	});
});

// -----------------------------------------------
// Media custom field
const MediaCollection = new CollectionBuilder("collection", {
	mode: "multiple",
	title: "Test",
	singular: "Test",
	translations: true,
})
	.addMedia("standard_media")
	.addMedia("required_media", {
		validation: {
			required: true,
		},
	})
	.addMedia("min_width_media", {
		validation: {
			width: {
				min: 100,
			},
		},
	})
	.addMedia("max_width_media", {
		validation: {
			width: {
				max: 200,
			},
		},
	})
	.addMedia("min_height_media", {
		validation: {
			height: {
				min: 100,
			},
		},
	})
	.addMedia("max_height_media", {
		validation: {
			height: {
				max: 200,
			},
		},
	})
	.addMedia("type_media", {
		validation: {
			type: "image",
		},
	})
	.addMedia("extension_media", {
		validation: {
			extensions: ["png"],
		},
	});

test("successfully validate field - media", async () => {
	// Standard
	const standardValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "standard_media",
			type: "media",
			value: 1,
			localeCode: "en",
		},
		instance: MediaCollection,
		media: [
			{
				id: 1,
				type: "image",
				file_extension: "png",
				width: 150,
				height: 150,
			},
		],
		users: [],
	});
	expect(standardValidate).toBe(null);

	// Required
	const requiredValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "required_media",
			type: "media",
			value: 1,
			localeCode: "en",
		},
		instance: MediaCollection,
		media: [
			{
				id: 1,
				type: "image",
				file_extension: "png",
				width: 150,
				height: 150,
			},
		],
		users: [],
	});
	expect(requiredValidate).toBe(null);

	// Min width
	const minWidthValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "min_width_media",
			type: "media",
			value: 1,
			localeCode: "en",
		},
		instance: MediaCollection,
		media: [
			{
				id: 1,
				type: "image",
				file_extension: "png",
				width: 150,
				height: 150,
			},
		],
		users: [],
	});
	expect(minWidthValidate).toBe(null);

	// Max width
	const maxWidthValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "max_width_media",
			type: "media",
			value: 1,
			localeCode: "en",
		},
		instance: MediaCollection,
		media: [
			{
				id: 1,
				type: "image",
				file_extension: "png",
				width: 150,
				height: 150,
			},
		],
		users: [],
	});
	expect(maxWidthValidate).toBe(null);

	// Min height
	const minHeightValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "min_height_media",
			type: "media",
			value: 1,
			localeCode: "en",
		},
		instance: MediaCollection,
		media: [
			{
				id: 1,
				type: "image",
				file_extension: "png",
				width: 150,
				height: 150,
			},
		],
		users: [],
	});
	expect(minHeightValidate).toBe(null);

	// Max height
	const maxHeightValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "max_height_media",
			type: "media",
			value: 1,
			localeCode: "en",
		},
		instance: MediaCollection,
		media: [
			{
				id: 1,
				type: "image",
				file_extension: "png",
				width: 150,
				height: 150,
			},
		],
		users: [],
	});
	expect(maxHeightValidate).toBe(null);

	// Type
	const typeValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "type_media",
			type: "media",
			value: 1,
			localeCode: "en",
		},
		instance: MediaCollection,
		media: [
			{
				id: 1,
				type: "image",
				file_extension: "png",
				width: 150,
				height: 150,
			},
		],
		users: [],
	});
	expect(typeValidate).toBe(null);

	// Extension
	const extensionValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "extension_media",
			type: "media",
			value: 1,
			localeCode: "en",
		},
		instance: MediaCollection,
		media: [
			{
				id: 1,
				type: "image",
				file_extension: "png",
				width: 150,
				height: 150,
			},
		],
		users: [],
	});
	expect(extensionValidate).toBe(null);
});
test("fail to validate field - media", async () => {
	// Required
	const requiredValidate = {
		exists: validateField({
			brickId: CONSTANTS.collectionBrickId,
			field: {
				key: "required_media",
				type: "media",
				value: 1,
				localeCode: "en",
			},
			instance: MediaCollection,
			media: [],
			users: [],
		}),
		null: validateField({
			brickId: CONSTANTS.collectionBrickId,
			field: {
				key: "required_media",
				type: "media",
				value: null,
				localeCode: "en",
			},
			instance: MediaCollection,
			media: [],
			users: [],
		}),
	};
	expect(requiredValidate).toEqual({
		exists: {
			key: "required_media",
			brickId: CONSTANTS.collectionBrickId,
			localeCode: "en",
			groupId: undefined,
			message: T("generic_field_required"),
		},
		null: {
			key: "required_media",
			brickId: CONSTANTS.collectionBrickId,
			localeCode: "en",
			groupId: undefined,
			message: T("generic_field_required"),
		},
	});

	// Min width
	const minWidthValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "min_width_media",
			type: "media",
			value: 1,
			localeCode: "en",
		},
		instance: MediaCollection,
		media: [
			{
				id: 1,
				type: "image",
				file_extension: "png",
				width: 50,
				height: 150,
			},
		],
		users: [],
	});
	expect(minWidthValidate).toEqual({
		key: "min_width_media",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: T("field_media_min_width", {
			min: 100,
		}),
	});

	// Max width
	const maxWidthValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "max_width_media",
			type: "media",
			value: 1,
			localeCode: "en",
		},
		instance: MediaCollection,
		media: [
			{
				id: 1,
				type: "image",
				file_extension: "png",
				width: 1000,
				height: 150,
			},
		],
		users: [],
	});
	expect(maxWidthValidate).toEqual({
		key: "max_width_media",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: T("field_media_max_width", {
			max: 200,
		}),
	});

	// Min height
	const minHeightValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "min_height_media",
			type: "media",
			value: 1,
			localeCode: "en",
		},
		instance: MediaCollection,
		media: [
			{
				id: 1,
				type: "image",
				file_extension: "png",
				width: 150,
				height: 50,
			},
		],
		users: [],
	});
	expect(minHeightValidate).toEqual({
		key: "min_height_media",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: T("field_media_min_height", {
			min: 100,
		}),
	});

	// Max height
	const maxHeightValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "max_height_media",
			type: "media",
			value: 1,
			localeCode: "en",
		},
		instance: MediaCollection,
		media: [
			{
				id: 1,
				type: "image",
				file_extension: "png",
				width: 150,
				height: 1000,
			},
		],
		users: [],
	});
	expect(maxHeightValidate).toEqual({
		key: "max_height_media",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: T("field_media_max_height", {
			max: 200,
		}),
	});

	// Type
	const typeValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "type_media",
			type: "media",
			value: 1,
			localeCode: "en",
		},
		instance: MediaCollection,
		media: [
			{
				id: 1,
				type: "document",
				file_extension: "pdf",
				width: null,
				height: null,
			},
		],
		users: [],
	});
	expect(typeValidate).toEqual({
		key: "type_media",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: T("field_media_type", {
			type: "image",
		}),
	});

	// Extension
	const extensionValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "extension_media",
			type: "media",
			value: 1,
			localeCode: "en",
		},
		instance: MediaCollection,
		media: [
			{
				id: 1,
				type: "image",
				file_extension: "jpg",
				width: 150,
				height: 150,
			},
		],
		users: [],
	});
	expect(extensionValidate).toEqual({
		key: "extension_media",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: T("field_media_extension", {
			extensions: "png",
		}),
	});
});

// -----------------------------------------------
// Number custom field
const NumberCollection = new CollectionBuilder("collection", {
	mode: "multiple",
	title: "Test",
	singular: "Test",
	translations: true,
})
	.addNumber("standard_number")
	.addNumber("required_number", {
		validation: {
			required: true,
		},
	})
	.addNumber("min_number", {
		validation: {
			zod: z.number().min(5),
		},
	});
test("successfully validate field - number", async () => {
	// Standard
	const standardValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "standard_number",
			type: "number",
			value: 1,
			localeCode: "en",
		},
		instance: NumberCollection,
		media: [],
		users: [],
	});
	expect(standardValidate).toBe(null);

	// Required
	const requiredValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "required_number",
			type: "number",
			value: 1,
			localeCode: "en",
		},
		instance: NumberCollection,
		media: [],
		users: [],
	});
	expect(requiredValidate).toBe(null);

	// Zod
	const zodValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "min_number",
			type: "number",
			value: 5,
			localeCode: "en",
		},
		instance: NumberCollection,
		media: [],
		users: [],
	});
	expect(zodValidate).toBe(null);
});
test("fail to validate field - number", async () => {
	// Standard;
	const standardValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "standard_number",
			type: "number",
			value: "1",
			localeCode: "en",
		},
		instance: NumberCollection,
		media: [],
		users: [],
	});
	expect(standardValidate).toEqual({
		key: "standard_number",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: "Expected number, received string", // zod error message
	});

	// Required
	const requiredValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "required_number",
			type: "number",
			value: undefined,
			localeCode: "en",
		},
		instance: NumberCollection,
		media: [],
		users: [],
	});
	expect(requiredValidate).toEqual({
		key: "required_number",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: T("generic_field_required"),
	});

	// Zod
	const zodValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "min_number",
			type: "number",
			value: 1,
			localeCode: "en",
		},
		instance: NumberCollection,
		media: [],
		users: [],
	});
	expect(zodValidate).toEqual({
		key: "min_number",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: "Number must be greater than or equal to 5", // zod error message
	});
});

// -----------------------------------------------
// Select custom field
const SelectCollection = new CollectionBuilder("collection", {
	mode: "multiple",
	title: "Test",
	singular: "Test",
	translations: true,
})
	.addSelect("standard_select", {
		options: CONSTANTS.selectOptions,
	})
	.addSelect("required_select", {
		options: CONSTANTS.selectOptions,
		validation: {
			required: true,
		},
	});

test("successfully validate field - select", async () => {
	// Standard
	const standardValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "standard_select",
			type: "select",
			value: "option-1",
			localeCode: "en",
		},
		instance: SelectCollection,
		media: [],
		users: [],
	});
	expect(standardValidate).toBe(null);

	// Required
	const requiredValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "required_select",
			type: "select",
			value: "option-1",
			localeCode: "en",
		},
		instance: SelectCollection,
		media: [],
		users: [],
	});
	expect(requiredValidate).toBe(null);
});
test("fail to validate field - select", async () => {
	// Standard
	const standardValidate = {
		exists: validateField({
			brickId: CONSTANTS.collectionBrickId,
			field: {
				key: "standard_select",
				type: "select",
				value: "option-10",
				localeCode: "en",
			},
			instance: SelectCollection,
			media: [],
			users: [],
		}),
		number: validateField({
			brickId: CONSTANTS.collectionBrickId,
			field: {
				key: "standard_select",
				type: "select",
				value: 1,
				localeCode: "en",
			},
			instance: SelectCollection,
			media: [],
			users: [],
		}),
	};
	expect(standardValidate).toEqual({
		exists: {
			key: "standard_select",
			brickId: CONSTANTS.collectionBrickId,
			localeCode: "en",
			groupId: undefined,
			message: T("please_ensure_a_valid_option_is_selected"),
		},
		number: {
			key: "standard_select",
			brickId: CONSTANTS.collectionBrickId,
			localeCode: "en",
			groupId: undefined,
			message: "Expected string, received number", // zod error message
		},
	});

	// Required
	const requiredValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "required_select",
			type: "select",
			value: undefined,
			localeCode: "en",
		},
		instance: SelectCollection,
		media: [],
		users: [],
	});
	expect(requiredValidate).toEqual({
		key: "required_select",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: T("select_field_required"),
	});
});

// -----------------------------------------------
// Text custom field
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

test("successfully validate field - text", async () => {
	// Standard
	const standardValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "standard_text",
			type: "text",
			value: "Standard text",
			localeCode: "en",
		},
		instance: TextCollection,
		media: [],
		users: [],
	});
	expect(standardValidate).toBe(null);

	// Required
	const requiredValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "required_text",
			type: "text",
			value: "Required text",
			localeCode: "en",
		},
		instance: TextCollection,
		media: [],
		users: [],
	});
	expect(requiredValidate).toBe(null);

	// Min length
	const minLengthValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "min_length_text",
			type: "text",
			value: "Min length text",
			localeCode: "en",
		},
		instance: TextCollection,
		media: [],
		users: [],
	});
	expect(minLengthValidate).toBe(null);
});
test("fail to validate field - text", async () => {
	// Standard
	const standardValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "standard_text",
			type: "text",
			value: 100,
			localeCode: "en",
		},
		instance: TextCollection,
		media: [],
		users: [],
	});
	expect(standardValidate).toEqual({
		key: "standard_text",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: "Expected string, received number", // zod error message
	});

	// Required
	const requiredValidate = {
		undefined: validateField({
			brickId: CONSTANTS.collectionBrickId,
			field: {
				key: "required_text",
				type: "text",
				value: undefined,
				localeCode: "en",
			},
			instance: TextCollection,
			media: [],
			users: [],
		}),
		null: validateField({
			brickId: CONSTANTS.collectionBrickId,
			field: {
				key: "required_text",
				type: "text",
				value: null,
				localeCode: "en",
			},
			instance: TextCollection,
			media: [],
			users: [],
		}),
		empty: validateField({
			brickId: CONSTANTS.collectionBrickId,
			field: {
				key: "required_text",
				type: "text",
				value: "",
				localeCode: "en",
			},
			instance: TextCollection,
			media: [],
			users: [],
		}),
	};
	expect(requiredValidate).toEqual({
		undefined: {
			key: "required_text",
			brickId: CONSTANTS.collectionBrickId,
			localeCode: "en",
			groupId: undefined,
			message: T("generic_field_required"),
		},
		null: {
			key: "required_text",
			brickId: CONSTANTS.collectionBrickId,
			localeCode: "en",
			groupId: undefined,
			message: T("generic_field_required"),
		},
		empty: {
			key: "required_text",
			brickId: CONSTANTS.collectionBrickId,
			localeCode: "en",
			groupId: undefined,
			message: T("generic_field_required"),
		},
	});

	// Min length
	const minLengthValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "min_length_text",
			type: "text",
			value: "1",
			localeCode: "en",
		},
		instance: TextCollection,
		media: [],
		users: [],
	});
	expect(minLengthValidate).toEqual({
		key: "min_length_text",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: "String must contain at least 5 character(s)", // zod error message
	});
});

// -----------------------------------------------
// Textarea custom field
const TextareaCollection = new CollectionBuilder("collection", {
	mode: "multiple",
	title: "Test",
	singular: "Test",
	translations: true,
})
	.addTextarea("standard_textarea")
	.addTextarea("required_textarea", {
		validation: {
			required: true,
		},
	})
	.addTextarea("min_length_textarea", {
		validation: {
			zod: z.string().min(5),
		},
	});
test("successfully validate field - textarea", async () => {
	// Standard
	const standardValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "standard_textarea",
			type: "textarea",
			value: "Standard textarea",
			localeCode: "en",
		},
		instance: TextareaCollection,
		media: [],
		users: [],
	});
	expect(standardValidate).toBe(null);

	// Required
	const requiredValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "required_textarea",
			type: "textarea",
			value: "Required textarea",
			localeCode: "en",
		},
		instance: TextareaCollection,
		media: [],
		users: [],
	});
	expect(requiredValidate).toBe(null);

	// Min length
	const minLengthValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "min_length_textarea",
			type: "textarea",
			value: "Min length textarea",
			localeCode: "en",
		},
		instance: TextareaCollection,
		media: [],
		users: [],
	});
	expect(minLengthValidate).toBe(null);
});
test("fail to validate field - textarea", async () => {
	// Standard
	const standardValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "standard_textarea",
			type: "textarea",
			value: 100,
			localeCode: "en",
		},
		instance: TextareaCollection,
		media: [],
		users: [],
	});
	expect(standardValidate).toEqual({
		key: "standard_textarea",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: "Expected string, received number", // zod error message
	});

	// Required
	const requiredValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "required_textarea",
			type: "textarea",
			value: undefined,
			localeCode: "en",
		},
		instance: TextareaCollection,
		media: [],
		users: [],
	});
	expect(requiredValidate).toEqual({
		key: "required_textarea",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: T("generic_field_required"),
	});

	// Min length
	const minLengthValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "min_length_textarea",
			type: "textarea",
			value: "1",
			localeCode: "en",
		},
		instance: TextareaCollection,
		media: [],
		users: [],
	});
	expect(minLengthValidate).toEqual({
		key: "min_length_textarea",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: "String must contain at least 5 character(s)", // zod error message
	});
});

// -----------------------------------------------
// User custom field
const UserCollection = new CollectionBuilder("collection", {
	mode: "multiple",
	title: "Test",
	singular: "Test",
	translations: true,
})
	.addUser("standard_user")
	.addUser("required_user", {
		validation: {
			required: true,
		},
	});
test("successfully validate field - user", async () => {
	// Standard
	const standardValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "standard_user",
			type: "user",
			value: 1,
			localeCode: "en",
		},
		instance: UserCollection,
		media: [],
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
	expect(standardValidate).toBe(null);

	// Required
	const requiredValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "required_user",
			type: "user",
			value: 1,
			localeCode: "en",
		},
		instance: UserCollection,
		media: [],
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
	expect(requiredValidate).toBe(null);
});
test("fail to validate field - user", async () => {
	// Required
	const requiredValidate = {
		exists: validateField({
			brickId: CONSTANTS.collectionBrickId,
			field: {
				key: "required_user",
				type: "user",
				value: 1,
				localeCode: "en",
			},
			instance: UserCollection,
			media: [],
			users: [],
		}),
		null: validateField({
			brickId: CONSTANTS.collectionBrickId,
			field: {
				key: "required_user",
				type: "user",
				value: null,
				localeCode: "en",
			},
			instance: UserCollection,
			media: [],
			users: [],
		}),
	};
	expect(requiredValidate).toEqual({
		exists: {
			key: "required_user",
			brickId: CONSTANTS.collectionBrickId,
			localeCode: "en",
			groupId: undefined,
			message: T("generic_field_required"),
		},
		null: {
			key: "required_user",
			brickId: CONSTANTS.collectionBrickId,
			localeCode: "en",
			groupId: undefined,
			message: T("generic_field_required"),
		},
	});
});

// -----------------------------------------------
// Wysiwyg custom field
const WysiwygCollection = new CollectionBuilder("collection", {
	mode: "multiple",
	title: "Test",
	singular: "Test",
	translations: true,
})
	.addWysiwyg("standard_wysiwyg")
	.addWysiwyg("required_wysiwyg", {
		validation: {
			required: true,
		},
	})
	.addWysiwyg("min_length_wysiwyg", {
		validation: {
			zod: z.string().min(5),
		},
	});
test("successfully validate field - wysiwyg", async () => {
	// Standard
	const standardValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "standard_wysiwyg",
			type: "wysiwyg",
			value: "<h1>Heading</h1><p>Body</p>",
			localeCode: "en",
		},
		instance: WysiwygCollection,
		media: [],
		users: [],
	});
	expect(standardValidate).toBe(null);

	// Required
	const requiredValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "required_wysiwyg",
			type: "wysiwyg",
			value: "<h1>Heading</h1><p>Body</p>",
			localeCode: "en",
		},
		instance: WysiwygCollection,
		media: [],
		users: [],
	});
	expect(requiredValidate).toBe(null);

	// Min length
	const minLengthValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "min_length_wysiwyg",
			type: "wysiwyg",
			value: "<h1>Heading</h1><p>Body</p>",
			localeCode: "en",
		},
		instance: WysiwygCollection,
		media: [],
		users: [],
	});
	expect(minLengthValidate).toBe(null);
});
test("fail to validate field - wysiwyg", async () => {
	// Standard
	const standardValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "standard_wysiwyg",
			type: "wysiwyg",
			value: 100,
			localeCode: "en",
		},
		instance: WysiwygCollection,
		media: [],
		users: [],
	});
	expect(standardValidate).toEqual({
		key: "standard_wysiwyg",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: "Expected string, received number", // zod error message
	});

	// Required
	const requiredValidate = {
		exists: validateField({
			brickId: CONSTANTS.collectionBrickId,
			field: {
				key: "required_wysiwyg",
				type: "wysiwyg",
				value: undefined,
				localeCode: "en",
			},
			instance: WysiwygCollection,
			media: [],
			users: [],
		}),
		null: validateField({
			brickId: CONSTANTS.collectionBrickId,
			field: {
				key: "required_wysiwyg",
				type: "wysiwyg",
				value: null,
				localeCode: "en",
			},
			instance: WysiwygCollection,
			media: [],
			users: [],
		}),
	};
	expect(requiredValidate).toEqual({
		exists: {
			key: "required_wysiwyg",
			brickId: CONSTANTS.collectionBrickId,
			localeCode: "en",
			groupId: undefined,
			message: T("generic_field_required"),
		},
		null: {
			key: "required_wysiwyg",
			brickId: CONSTANTS.collectionBrickId,
			localeCode: "en",
			groupId: undefined,
			message: T("generic_field_required"),
		},
	});

	// Min length
	const minLengthValidate = validateField({
		brickId: CONSTANTS.collectionBrickId,
		field: {
			key: "min_length_wysiwyg",
			type: "wysiwyg",
			value: "Hi",
			localeCode: "en",
		},
		instance: WysiwygCollection,
		media: [],
		users: [],
	});
	expect(minLengthValidate).toEqual({
		key: "min_length_wysiwyg",
		brickId: CONSTANTS.collectionBrickId,
		localeCode: "en",
		groupId: undefined,
		message: "String must contain at least 5 character(s)", // zod error message
	});
});
