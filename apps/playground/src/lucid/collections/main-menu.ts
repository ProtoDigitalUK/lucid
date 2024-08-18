import { CollectionBuilder } from "@lucidcms/core";

const MainMenuCollection = new CollectionBuilder("main-menu", {
	mode: "single",
	title: "Main Menu",
	singular: "Main Menu",
	description: "The main menu for your website.",
	translations: true,
})
	.addRepeater("items", {
		labels: {
			title: "Items",
		},
		validation: {
			maxGroups: 5,
		},
	})
	.addDocument("item", {
		collection: "page",
	})
	.endRepeater();

export default MainMenuCollection;
