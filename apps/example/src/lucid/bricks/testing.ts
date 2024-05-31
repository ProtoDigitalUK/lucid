import { BrickBuilder } from "@lucidcms/core";

const TestingBrick = new BrickBuilder("testing", {
	preview: {
		image: "https://usersnap.com/blog/wp-content/uploads/2021/03/7-Common-Types-of-Software-Testing@1x-1280x720.png",
	},
})
	.addTab("content_tab", {
		labels: {
			title: "Content",
		},
	})
	.addText("text-key", {
		labels: {
			title: "Text",
			description: "Testing title",
			placeholder: "Testing title",
		},
	})
	.addWysiwyg("wysiwyg-key")
	.addMedia("media-key", {
		validation: {
			extensions: ["png"],
			type: "image",
		},
	})
	.addRepeater("repeater-key")
	.addText("repeater-title")
	.addRepeater("repeater-key-nested")
	.addText("repeater-title-nested")
	.endRepeater()
	.endRepeater()
	.addNumber("number-key")
	.addCheckbox("checkbox-key", {
		labels: {
			title: "Checkbox",
			true: "Show",
			false: "Hide",
		},
	})
	.addSelect("select-key", {
		options: [
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
		validation: {
			required: true,
		},
	})
	.addTextarea("textarea-key", {
		labels: {
			title: "Textarea",
			placeholder: "Testing textarea",
			description: "Testing textarea",
		},
	})
	.addTab("advanced_tab", {
		labels: {
			title: "Advanced",
		},
	})
	.addJSON("json-key")
	.addColour("colour-key", {
		presets: ["#000000", "#ffffff"],
	})
	.addDateTime("datetime-key")
	.addLink("link-key");

export default TestingBrick;
