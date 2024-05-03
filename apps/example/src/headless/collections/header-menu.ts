import { CollectionBuilder } from "@protoheadless/core";

const HeaderMenuCollection = new CollectionBuilder("header-menu", {
	mode: "single",
	title: "Header Menu",
	singular: "Heading Menu",
	description: "The header menu of the website.",
})
	.addRepeater({
		key: "menu_items",
		title: "Menu Items",
	})
	.addText({
		key: "title",
		title: "Title",
	})
	.addText({
		key: "url",
		title: "URL",
	})
	.addRepeater({
		key: "sub_menu_items",
		title: "Sub Menu Items",
	})
	.addText({
		key: "sub_menu_title",
		title: "Title",
	})
	.addText({
		key: "sub_menu_url",
		title: "URL",
	})
	.endRepeater()
	.endRepeater();

export default HeaderMenuCollection;
