import { CollectionBuilder } from "@protodigital/headless";

const FormsCollection = new CollectionBuilder("forms", {
	multiple: true,
	title: "Forms",
	singular: "Form",
	description: "View and manage form submission data.",
})
	.addText({
		key: "form_name",
	})
	.addText({
		key: "first_name",
	})
	.addText({
		key: "last_name",
	})
	.addTextarea({
		key: "message",
	});

export default FormsCollection;
