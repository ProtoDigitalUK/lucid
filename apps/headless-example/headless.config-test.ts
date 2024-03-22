import { headlessConfigNew, BrickBuilder } from "@protodigital/headless";
// Bricks
import BannerBrick from "./src/headless/bricks/banner.js";
import IntroBrick from "./src/headless/bricks/intro.js";
import DefaultMetaBrick from "./src/headless/bricks/default-meta.js";
import TestingBrick from "./src/headless/bricks/testing.js";
import PageMetaBrick from "./src/headless/bricks/page-meta.js";
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
		BannerBrick,
		IntroBrick,
		DefaultMetaBrick,
		TestingBrick,
		PageMetaBrick,
		new BrickBuilder("bannertest", {
			preview: {
				image: true,
			},
		})
			.addTab({
				title: "Content",
				key: "content_tab",
			})
			.addTab({
				title: "Content",
				key: "content_tab",
			}),
	],
});
