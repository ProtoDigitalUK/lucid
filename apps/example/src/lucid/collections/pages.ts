import { CollectionBuilder } from "@lucidcms/core";
import z from "zod";
// Bricks
import BannerBrick from "../bricks/banner.js";
import IntroBrick from "../bricks/intro.js";
import TestingBrick from "../bricks/testing.js";
import DefaultMetaBrick from "../bricks/default-meta.js";
import PageMetaBrick from "../bricks/page-meta.js";

const PageCollection = new CollectionBuilder("page", {
	mode: "multiple",
	title: "Pages",
	singular: "Page",
	description: "Pages are used to create static content on your website.",
	translations: true,
	hooks: [
		{
			event: "beforeUpsert",
			handler: async (props) => {
				return {
					document_id: props.data.documentId,
					fields: props.data.fields?.map((field) => {
						if (field.key === "page_title" && field.value) {
							field.value = `${field.value} - Modified`;
						}
						return field;
					}),
					bricks: props.data.bricks,
				};
			},
		},
		{
			event: "beforeDelete",
			handler: async (props) => {
				console.log("beforeDelete hook collection", props.data.ids);
			},
		},
		{
			event: "afterDelete",
			handler: async (props) => {
				console.log("afterDelete hook collection", props.data.ids);
			},
		},
	],
	bricks: {
		fixed: [DefaultMetaBrick, PageMetaBrick],
		builder: [BannerBrick, IntroBrick, TestingBrick],
	},
})
	.addText({
		key: "page_title",
		hidden: false,
		disabled: false,
		collection: {
			list: true,
			filterable: true,
		},
	})
	.addTextarea({
		key: "page_excerpt",
		collection: {
			list: true,
			filterable: true,
		},
	})
	.addCheckbox({
		key: "page_featured",
		collection: {
			list: true,
			filterable: true,
		},
	})
	.addUser({
		key: "author",
		collection: {
			list: true,
		},
	})
	.addRepeater({
		key: "notifications",
		validation: {
			maxGroups: 3,
		},
	})
	.addText({
		key: "notification_title",
		collection: {
			list: true,
			filterable: true,
		},
	})
	.addRepeater({
		key: "notification_reason",
		validation: {
			maxGroups: 3,
		},
	})
	.addText({
		key: "notification_reason_title",
		validation: {
			required: true,
			zod: z.string().min(3).max(100),
		},
	})
	.endRepeater()
	.endRepeater();

export default PageCollection;
