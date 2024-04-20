import { CollectionBuilder } from "@protoheadless/core";

// TODO: replace with form builder plugin to better abstract this and provide additional services (form submissions, reCaptcha, validation, honeypots etc.)

const FormsCollection = new CollectionBuilder("forms", {
	mode: "multiple",
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
