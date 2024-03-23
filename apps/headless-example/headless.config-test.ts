import { headlessConfigNew, BrickBuilderNew } from "@protodigital/headless";
// Collections
import PageCollection from "./src/headless/collections/pages.js";
import BlogCollection from "./src/headless/collections/blogs.js";
import SettingsCollection from "./src/headless/collections/settings.js";

export default headlessConfigNew({
	mode: "development",
	host: "http://localhost:8393",
	databaseUrl: process.env.DATABASE_URL as string,
	keys: {
		cookieSecret: process.env.HEADLESS_COOKIE_SECRET as string,
		refreshTokenSecret: process.env.HEADLESS_REFRESH_TOKEN_SECRET as string,
		accessTokenSecret: process.env.HEADLESS_ACCESS_TOKEN_SECRET as string,
	},
	collections: [PageCollection, BlogCollection, SettingsCollection],
	bricks: [
		new BrickBuilderNew("banner", {
			preview: {
				image: "https://headless-dev.up.railway.app/public/banner-brick.png",
			},
		})
			.addTab({
				title: "Content",
				key: "content_tab",
			})
			.addText({
				key: "title",
				description: "The title of the banner",
				validation: {
					required: true,
				},
			})
			.addWysiwyg({
				key: "intro",
			})
			.addPageLink({
				key: "page-link",
			})
			.addRepeater({
				key: "social_links",
				validation: {
					maxGroups: 3,
				},
			})
			.addText({
				key: "social_title",
			})
			.addText({
				key: "social_url",
			})
			.addRepeater({
				key: "icons",
				validation: {
					maxGroups: 3,
				},
			})
			.addText({
				key: "icon_text",
			})
			.addText({
				key: "icon_url",
			})
			.endRepeater()
			.endRepeater()
			.addTab({
				title: "Config",
				key: "config_tab",
			})
			.addCheckbox({
				key: "fullwidth",
				description: "Make the banner fullwidth",
			}),
		new BrickBuilderNew("bannertest", {
			preview: {
				image: "true",
			},
		})
			.addTab({
				title: "Content",
				key: "content_tab",
			})
			.addTab({
				title: "Content",
				key: "content_tab_2",
			}),
	],
});
